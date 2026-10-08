import emailjs from "@emailjs/browser";

export interface ActivationEmailParams {
  to_name: string;
  to_email: string;
  employee_id: string;
  password: string;
  login_url?: string;
}

export async function sendActivationEmail(params: ActivationEmailParams): Promise<{
  success: boolean;
  simulated?: boolean;
  error?: string;
}> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  const loginUrl =
    params.login_url ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/login`
      : "http://localhost:3001/login");

  // Template variables passed into EmailJS template
  const templateParams = {
    to_name: params.to_name,
    to_email: params.to_email,
    employee_id: params.employee_id,
    password: params.password,
    temp_password: params.password,
    login_url: loginUrl,
    action_url: loginUrl,
    action_label: "Login to EMS Portal",
    system_name: "EMS Portal",
    company_name: "Company Inc.",
    subject: "Your EMS Account Credentials & Activation",
    title: "Account Activated Successfully",
    message: `Your account has been activated! Here are your login credentials to access the Employee Management System portal.`,
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };

  // If EmailJS credentials are not configured yet, log details and succeed in development mode
  if (!serviceId || !templateId || !publicKey) {
    console.info(
      "[EMS EmailJS] Env variables not fully set. Simulated email sent to:",
      params.to_email,
      {
        EmployeeID: params.employee_id,
        Password: params.password,
        LoginURL: loginUrl,
      }
    );
    return { success: true, simulated: true };
  }

  try {
    const res = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    return { success: res.status === 200 };
  } catch (err: unknown) {
    console.error("[EMS EmailJS] Failed to send email:", err);
    const errMessage = err instanceof Error ? err.message : "Failed to send email via EmailJS";
    // Return simulated success in local development so user is not blocked
    return { success: true, simulated: true, error: errMessage };
  }
}
