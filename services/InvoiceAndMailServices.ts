import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError } from './ErrorService';
import uuid from 'react-native-uuid';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { ClientInfo } from '@/Interface/ClientInfoProps';
import { generateInvoice } from './CreateInvoiceAiServices';
import { generateLocalTemplate } from './GenerateLocalInvoiceServices';
import { PdfServices } from './PdfServices';
import { UploadPdfServices } from './UploadPdfServices';
import { EmailInvoiceServices } from './EmailInvoiceServices';
import { GetInvoiceDownloadUrl } from './GetUploadB2Services';

export const InvoiceAndMailServices = async (
  projectId: string,
  taskId: string
): Promise<{ success: boolean; message: string; invoice_id: string }> => {
  if (!projectId || !taskId) {
    throw new Error('Please provide projectId and taskId');
  }

  const userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    const taskRef = doc(
      db,
      `users/${userId}/projects/${projectId}/tasks/${taskId}`
    );
    const taskSnap = await getDoc(taskRef);

    if (!taskSnap.exists()) {
      throw new Error('Task not exsist');
    }

    const taskData = taskSnap.data();
    if (taskData.status !== 'Completed') {
      throw new Error('The task is not completed');
    }

    console.log('taskdata get');

    const projectRef = doc(db, `users/${userId}/projects/${projectId}`);
    const projecSnap = await getDoc(projectRef);

    if (!projecSnap.exists()) {
      throw new Error('Project not exsist');
    }

    const projectData = projecSnap.data();
    const clientId = projectData.client_id;
    if (!clientId) {
      throw new Error('No client found');
    }

    console.log('projectData get');

    const clientRef = doc(db, `users/${userId}/clients/${clientId}`);
    const clientSnap = await getDoc(clientRef);

    if (!clientSnap.exists()) {
      throw new Error('Client not exsist');
    }

    const clientData = clientSnap.data();

    const clientInfo: ClientInfo = {
      client_id: clientId,
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
    };

    if (!clientInfo.email) {
      throw new Error('Email required for invoicing');
    }

    console.log('clientData get');

    const userRef = doc(db, `users/${userId}`);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error('User not exsist');
    }

    const userData = userSnap.data();

    const freelancerEmail = userData.email;
    if (!freelancerEmail) {
      throw new Error('Your mail is required for invoicing');
    }

    console.log('userdata get');

    const qoutaRef = doc(db, `users/${userId}/qouta`, 'usage');
    const qoutaSnap = await getDoc(qoutaRef);
    let aiCount = 0;
    let emailCount = 0;
    let isSubscribed = false;

    if (qoutaSnap.exists()) {
      const qoutaData = qoutaSnap.data();
      aiCount = qoutaData.ai_count || 0;
      emailCount = qoutaData.email_count || 0;
      isSubscribed = qoutaData.isSubscribed || false;
    }

    console.log('qoutaData get');

    const currentMonth = new Date().toISOString().slice(0, 7);
    if (qoutaSnap.exists() && qoutaSnap.data().month !== currentMonth) {
      aiCount = 0;
      emailCount = 0;
      await setDoc(
        qoutaRef,
        { ai_count: 0, email_count: 0, month: currentMonth },
        { merge: true }
      );
    }

    console.log('currentMonth get');

    const hourlyRate = projectData.hourly_rate;
    const hoursWorked = taskData.time_taken / 3600;
    const totalCost = hoursWorked * hourlyRate;
    const due_date = taskData.due_date;

    const invoiceId = `inv_${uuid.v4()}`;

    console.log(`invoiceId: ${invoiceId}`);

    let html: string;
    let template: 'AI' | 'Local' = 'AI';

    if (isSubscribed || aiCount < 2) {
      try {
        html = await generateInvoice({
          projectName: projectData.name,
          projectDescription: projectData.description,
          clientEmail: clientInfo.email,
          clientName: clientInfo.name,
          freelancerEmail: freelancerEmail,
          dueDate: due_date,
          hourlyRate: hourlyRate,
          task_name: taskData.name,
          totalTime: hoursWorked,
        });

        console.log(`ai generated: ${html}`);

        await setDoc(qoutaRef, { ai_count: aiCount + 1 }, { merge: true });
      } catch (error: any) {
        console.warn(
          'AI invoice generation failed, using local template:',
          error
        );

        await logError(
          userId,
          'CreateInvoiceService',
          `AI invoice generation failed: ${error.message}`
        );

        html = await generateLocalTemplate({
          projectName: projectData.name,
          projectDescription:
            projectData.description || 'No description provided',
          clientName: clientInfo.name,
          clientEmail: clientInfo.email,
          freelancerEmail,
          hourlyRate,
          totalTime: hoursWorked,
          taskName: taskData.name,
          dueDate: due_date,
          invoiceId,
        });
        template = 'Local';
      }
    } else {
      html = await generateLocalTemplate({
        projectName: projectData.name,
        projectDescription: projectData.description,
        clientEmail: clientInfo.email,
        clientName: clientInfo.name,
        freelancerEmail: freelancerEmail,
        dueDate: due_date,
        hourlyRate: hourlyRate,
        taskName: taskData.name,
        totalTime: hoursWorked,
        invoiceId: invoiceId,
      });

      console.log(`local generated: ${html}`);
    }

    const pdfPath = await PdfServices(`invoices_${invoiceId}`, html);

    console.log(`pdf converted: ${pdfPath}`);

    const uploadData = await UploadPdfServices(
      pdfPath,
      invoiceId,
      projectId,
      taskId,
      {
        task_id: taskId,
        task_name: taskData.name,
        total_cost: totalCost,
        project_id: projectId,
        project_description: projectData.description,
        project_name: projectData.name,
        user_id: userId,
        time_taken: taskData.time_taken,
        hourly_rate: hourlyRate,
        client_info: clientInfo,
        due_date: due_date,
        priority: taskData.priority,
        template_type: template,
        emailed: false,
      }
    );
    
    await setDoc(taskRef, { invoice_id: invoiceId }, { merge: true })
    
    console.log(`uploadData store: ${uploadData}`);

    const getPdfUrl = await GetInvoiceDownloadUrl(invoiceId);

    console.log(`getPdfUrl: ${getPdfUrl}`);

    let emailed = false;
    if (emailCount < 5 || isSubscribed) {
      try {
        await EmailInvoiceServices({
          to: clientInfo.email,
          subject: `Invoice for ${taskData.name} - MicroTasker`,
          body: `Dear ${clientInfo.name},\n\nWe hope you're doing well!\n\nPlease find attached the invoice for **${taskData.name}** under your project "**${projectData.name}**".\n\n💰 **Total Amount**: $${totalCost.toFixed(2)} \n\n 📅 **Due Date**: ${due_date}\n\nWe appreciate your business and look forward to continuing our partnership. If you have any questions or need assistance, feel free to reach out.\n\nWarm regards,\n\nThe MicroTasker Team`,
          attachment: getPdfUrl,
        });

        console.log(`email sent`);

        await EmailInvoiceServices({
          to: freelancerEmail,
          subject: `Invoice for ${taskData.name} - MicroTasker`,
          body: `Dear User,\n\nWe hope this message finds you well.\n\nPlease find attached your invoice for **${taskData.name}** under the project "**${projectData.name}**".\n\n💼 **Total Amount**: $${totalCost.toFixed(2)}\n\n 📅 **Due Date**: ${due_date}\n\nWe truly appreciate your trust in MicroTasker. If you have any questions or need assistance, don’t hesitate to contact us.\n\nThank you for choosing us!\n\nWarm regards,\n\nThe MicroTasker Team`,
          attachment: getPdfUrl,
        });

        emailed = true;
        await setDoc(
          qoutaRef,
          { email_count: emailCount + 1 },
          { merge: true }
        );

        await setDoc(
          doc(
            db,
            `users/${userId}/projects/${projectId}/tasks/${taskId}/invoices`,
            uploadData.id
          ),
          { emailed: true },
          { merge: true }
        );

        console.log(`data store updated`);
      } catch (emailError: any) {
        console.warn('Email sending failed:', emailError);
        await logError(
          userId,
          'CreateInvoiceService',
          `Email sending failed: ${emailError.message}`
        );
      }
    } else {
      console.warn('Email quota exceeded for free user');
      await logError(userId, 'CreateInvoiceService', 'Email quota exceeded');
    }

    console.log(
      `Invoice generated for task ${taskId}: total_cost=$${totalCost.toFixed(2)}, template=${template}, emailed=${emailed}`
    );

    return {
      success: true,
      message: emailed
        ? 'Invoice generated and emailed successfully'
        : 'Invoice generated successfully',
      invoice_id: uploadData.id,
    };
  } catch (error: any) {
    console.log('Error in generating invoice and sending mail', error);
    await logError(userId, 'InvoiceAndMailServices', error.message);
    await AsyncStorage.setItem(
      `pending_invoices_${uuid.v4()}`,
      JSON.stringify({ projectId, taskId })
    );
    throw new Error('Failed to Create Invoice');
  }
};
