import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError } from './ErrorService';
import { TemplateParams } from '@/Interface/TempelateProps';

export const generateLocalTemplate = async (
  option: TemplateParams
): Promise<string> => {
  const userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    // Escape HTML characters
    const escapeHTML = (str: string | undefined | null) =>
      (str ?? '').replace(
        /[&<>"']/g,
        (m) =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
          })[m] as string
      );

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>MicroTasker Invoice</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f3f4f6;
      margin: 0;
      padding: 20px;
    }
    .invoice-box {
      max-width: 800px;
      margin: auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      color: #333;
    }
    h1, h2 {
      margin: 0;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .header p {
      color: #00bfa6;
      font-weight: 500;
    }
    .section {
      margin-bottom: 20px;
    }
    .section h2 {
      font-size: 18px;
      margin-bottom: 8px;
      color: #111827;
    }
    .details p {
      margin: 4px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    table thead {
      background-color: #f9fafb;
    }
    table th, table td {
      padding: 12px;
      border: 1px solid #e5e7eb;
      text-align: right;
    }
    table th:first-child, table td:first-child {
      text-align: left;
    }
    .total-row td {
      font-weight: bold;
      background-color: #f3f4f6;
    }
    .footer {
      text-align: center;
      font-size: 13px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
      padding-top: 10px;
      margin-top: 30px;
    }
    .note {
      text-align: center;
      font-style: italic;
      color: #374151;
    }
  </style>
</head>
<body>
  <div class="invoice-box">
    <!-- Header -->
    <div class="header">
      <h1>MicroTasker Invoice</h1>
      <p>Futuristic Time-Tracking Solutions</p>
    </div>

    <!-- Invoice Details -->
    <div class="section details">
      <p><strong>Invoice ID:</strong> ${escapeHTML(option.invoiceId)}</p>
      <p><strong>Invoice Date:</strong> ${new Date().toISOString().slice(0, 10)}</p>
      <p><strong>Due Date:</strong> ${escapeHTML(option.dueDate)}</p>
    </div>

    <!-- Client and Freelancer Info -->
    <div class="section">
      <div style="display: flex; justify-content: space-between;">
        <div>
          <h2>Billed To:</h2>
          <p><strong>Client Name:</strong> ${escapeHTML(option.clientName)}</p>
          <p><strong>Client Email:</strong> ${escapeHTML(option.clientEmail)}</p>
        </div>
        <div>
          <h2>From:</h2>
          <p><strong>MicroTasker</strong></p>
          <p><strong>Email:</strong> ${escapeHTML(option.freelancerEmail)}</p>
        </div>
      </div>
    </div>

    <!-- Project Info -->
    <div class="section">
      <h2>Project Details:</h2>
      <p><strong>Project Name:</strong> ${escapeHTML(option.projectName)}</p>
      <p><strong>Task Name:</strong> ${escapeHTML(option.taskName)}</p>
      <p><strong>Description:</strong> ${escapeHTML(option.projectDescription)}</p>
    </div>

    <!-- Billing Summary -->
    <div class="section">
      <h2>Billing Summary:</h2>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${escapeHTML(option.taskName)}</td>
            <td>${option.totalTime.toFixed(2)} hours</td>
            <td>$${option.hourlyRate.toFixed(2)}</td>
            <td>$${(option.hourlyRate * option.totalTime).toFixed(2)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="3">Total</td>
            <td>$${(option.hourlyRate * option.totalTime).toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Payment Instructions -->
    <div class="section">
      <h2>Payment Instructions:</h2>
      <p>Please remit payment to <strong>payments@microtasker.com</strong> via bank transfer or PayPal by the due date.</p>
    </div>

    <!-- Closing Note -->
    <div class="note section">
      <p>Thank you for your business! We look forward to working with you again.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Generated by MicroTasker | support@microtasker.com</p>
    </div>
  </div>
</body>
</html>
`;

    return html;
  } catch (error: any) {
    console.error('Error generating local template:', error);
    await logError(userId, 'LocalTemplateService', error.message);
    throw new Error('Failed to generate local template');
  }
};
