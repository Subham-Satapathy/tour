import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Booking, Vehicle, City } from '@/server/db/schema';
import { db } from '@/server/db';
import { vehicles, cities, invoices } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

interface InvoiceData {
  booking: Booking;
  vehicle: Vehicle;
  fromCity: City;
  toCity: City;
}

/**
 * Generate invoice PDF and return as buffer for email attachment
 */
export async function generateInvoicePDFBuffer(bookingId: number): Promise<Buffer | null> {
  try {
    const doc = await createInvoicePDF(bookingId);
    if (!doc) return null;
    
    // Convert PDF to buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating invoice PDF buffer:', error);
    return null;
  }
}

/**
 * Create invoice PDF document
 */
async function createInvoicePDF(bookingId: number): Promise<jsPDF | null> {
  try {
    // Fetch booking details
    const booking = await db
      .select()
      .from(require('@/server/db/schema').bookings)
      .where(eq(require('@/server/db/schema').bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      console.error('Booking not found');
      return null;
    }

    const bookingData = booking[0];

    // Fetch vehicle details
    const vehicle = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, bookingData.vehicleId))
      .limit(1);

    if (vehicle.length === 0) {
      console.error('Vehicle not found');
      return null;
    }

    // Fetch city details
    const [fromCity] = await db
      .select()
      .from(cities)
      .where(eq(cities.id, bookingData.fromCityId))
      .limit(1);

    const [toCity] = await db
      .select()
      .from(cities)
      .where(eq(cities.id, bookingData.toCityId))
      .limit(1);

    // Generate invoice number
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(bookingId).padStart(6, '0')}`;

    // Create PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 20;

    // Load watermark logo for all pages
    let logoDataUrl: string | null = null;
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');
      if (fs.existsSync(logoPath)) {
        const logoBase64 = fs.readFileSync(logoPath).toString('base64');
        logoDataUrl = `data:image/png;base64,${logoBase64}`;
      }
    } catch (error) {
      console.error('Error loading watermark:', error);
    }

    // Function to add watermark to current page
    const addWatermark = () => {
      if (logoDataUrl) {
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.08 })); // 8% opacity for subtle watermark
        
        const logoSize = Math.min(pageWidth, pageHeight) * 0.65;
        const logoX = (pageWidth - logoSize) / 2;
        const logoY = (pageHeight - logoSize) / 2;
        
        doc.addImage(logoDataUrl, 'PNG', logoX, logoY, logoSize, logoSize);
        doc.restoreGraphicsState();
      }
    };

    // Add watermark to first page
    addWatermark();

    // Company Header
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('TRIVENI TOURS & TRAVELS', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Self Drive Cars, Bikes & Family Trips', pageWidth / 2, 30, { align: 'center' });

    currentY = 50;

    // Invoice Title & Number
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE', 14, currentY);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${invoiceNumber}`, pageWidth - 14, currentY, { align: 'right' });
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 14, currentY + 7, { align: 'right' });

    currentY += 20;

    // Customer Details Box
    doc.setFillColor(245, 245, 245);
    doc.rect(14, currentY, (pageWidth - 28) / 2 - 5, 35, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', 18, currentY + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(bookingData.customerName, 18, currentY + 14);
    doc.text(bookingData.customerEmail, 18, currentY + 20);
    doc.text(bookingData.customerPhone, 18, currentY + 26);

    // Booking Details Box
    doc.setFillColor(245, 245, 245);
    doc.rect(pageWidth / 2 + 5, currentY, (pageWidth - 28) / 2 - 5, 35, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('BOOKING DETAILS:', pageWidth / 2 + 9, currentY + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Booking ID: #${bookingData.id}`, pageWidth / 2 + 9, currentY + 14);
    doc.text(`Status: ${bookingData.status}`, pageWidth / 2 + 9, currentY + 20);
    if (bookingData.paymentReference) {
      doc.text(`Payment Ref: ${bookingData.paymentReference}`, pageWidth / 2 + 9, currentY + 26);
    }

    currentY += 45;

    // Trip Details Table

    // Trip Information Table (First Page)
    autoTable(doc, {
      startY: currentY,
      head: [['Trip Information', '']],
      body: [
        ['Vehicle', `${vehicle[0].name} (${vehicle[0].brand || ''} ${vehicle[0].model || ''})`],
        ['Route', `${fromCity.name} to ${toCity.name}`],
        ['Start Date & Time', new Date(bookingData.startDateTime).toLocaleString('en-IN')],
        ['End Date & Time', new Date(bookingData.endDateTime).toLocaleString('en-IN')],
        ['Duration', `${bookingData.tripDurationHours} hours`],
        ['Seating Capacity', `${vehicle[0].seatingCapacity || 'N/A'} seats`],
        ['Fuel Type', vehicle[0].fuelType || 'N/A'],
        ['Transmission', vehicle[0].transmissionType || 'N/A'],
      ],
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 'auto' },
      },
      theme: 'striped',
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      didDrawPage: addWatermark,
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    // Add a new page for payment info
    doc.addPage();
    addWatermark();
    currentY = 20;

    // Payment Info Table (Second Page)
    const tripDays = Math.ceil(bookingData.tripDurationHours / 24);
    const grandTotal = bookingData.totalAmount + (bookingData.securityDeposit || 0);
    const paymentRows: any[][] = [];
    if (bookingData.tripDurationHours < 24) {
      paymentRows.push([`Base Rental (Hourly): Rs.${bookingData.pricePerHour.toLocaleString('en-IN')}/hr x ${bookingData.tripDurationHours} hrs`, `Rs.${bookingData.totalAmount.toLocaleString('en-IN')}`]);
    } else {
      paymentRows.push([`Base Rental (Daily): Rs.${bookingData.pricePerDay.toLocaleString('en-IN')}/day x ${tripDays} day(s)`, `Rs.${bookingData.totalAmount.toLocaleString('en-IN')}`]);
    }
    if (bookingData.securityDeposit && bookingData.securityDeposit > 0) {
      paymentRows.push(['Security Deposit (Refundable)', `Rs.${bookingData.securityDeposit.toLocaleString('en-IN')}`]);
    }

    autoTable(doc, {
      startY: currentY,
      body: paymentRows,
      foot: [['GRAND TOTAL', `Rs.${grandTotal.toLocaleString('en-IN')}`]],
      columnStyles: {
        0: { cellWidth: 135, fontSize: 10 },
        1: { cellWidth: 45, halign: 'right', fontSize: 11, fontStyle: 'bold' },
      },
      footStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'right',
      },
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 5,
        lineColor: [220, 220, 220],
        lineWidth: 0.5,
      },
      didParseCell: function(data) {
        // Security deposit styling (orange text)
        if (data.section === 'body' && bookingData.securityDeposit && bookingData.securityDeposit > 0) {
          const securityDepositRowIndex = paymentRows.length === 2 ? 1 : -1;
          if (data.row.index === securityDepositRowIndex) {
            data.cell.styles.textColor = [217, 119, 6];
          }
        }
      },
      didDrawPage: addWatermark,
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;

    // Terms & Conditions
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Terms & Conditions:', 14, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const terms = [
      '• The vehicle must be returned in the same condition as provided.',
      '• Any damage to the vehicle will be charged to the customer.',
      '• Security deposit will be refunded within 7 business days after vehicle return.',
      '• Fuel charges are not included in the rental amount.',
      '• Valid driving license is mandatory during the entire rental period.',
      '• Late return charges: Rs.500 per hour beyond agreed time.',
      '• This is a computer-generated invoice and does not require a signature.',
    ];

    currentY += 7;
    terms.forEach((term) => {
      doc.text(term, 14, currentY);
      currentY += 5;
    });

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setDrawColor(200, 200, 200);
    doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing Triveni Tours & Travels!', pageWidth / 2, footerY, { align: 'center' });
    doc.text('For support: support@trivenitravels.com | +91 9337478478', pageWidth / 2, footerY + 5, { align: 'center' });

    return doc;
  } catch (error) {
    console.error('Error creating invoice PDF:', error);
    return null;
  }
}

/**
 * Generate invoice and save to database
 */
export async function generateInvoice(bookingId: number): Promise<string | null> {
  try {
    // Check if invoice already exists
    const existingInvoice = await db
      .select()
      .from(invoices)
      .where(eq(invoices.bookingId, bookingId))
      .limit(1);

    if (existingInvoice.length > 0) {
      return existingInvoice[0].invoiceNumber;
    }

    // Fetch booking to get total amount
    const booking = await db
      .select()
      .from(require('@/server/db/schema').bookings)
      .where(eq(require('@/server/db/schema').bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      return null;
    }

    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(bookingId).padStart(6, '0')}`;

    // Save invoice to database
    await db.insert(invoices).values({
      bookingId: bookingId,
      invoiceNumber: invoiceNumber,
      amount: booking[0].totalAmount,
      pdfUrl: null,
    });

    return invoiceNumber;
  } catch (error) {
    console.error('Error generating invoice:', error);
    return null;
  }
}
