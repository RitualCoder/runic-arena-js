import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Réinitialisez votre mot de passe",
    html: `<p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe: <a href="${resetLink}">${resetLink}</a></p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  console.log("confirmLink", confirmLink);

  const response = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Vérifiez votre email",
    html: `<p>Cliquez sur le lien suivant pour vérifier votre email: <a href="${confirmLink}">${confirmLink}</a></p>`,
  });

  if (response.error) {
    console.error("Error sending email", response.error);
    return { error: "Erreur lors de l'envoi de l'email" };
  }

  return { success: true };
};
