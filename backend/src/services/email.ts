import * as nodemailer from 'nodemailer' 
import * as fs from 'fs';

export const setupEmailServer = async () => {
  const transporter = nodemailer.createTransport({
		service: 'hotmail',
		auth: {
			user: process.env.EMAIL, 
			pass: process.env.PASSWORD,
		},
	});

	return transporter;
};

export const sendEmail = async(
	to: string | string[],
	subject: string,
	html?: string,
	text?: string
) => {
	const toStr = Array.isArray(to) ? to.join(', ') : to;
	const transporter = await setupEmailServer();
	const info = await transporter.sendMail({
		from: process.env.EMAIL,
		to: toStr,
		subject,
		text,
		html,
	});
	return info;
};

export const sendResetEmail = async (email: string, {firstName, lastName}: any, uri: string) => {
  let template = '';
  try {
    template = await readFile('src/templates/reset-password.html');
  } catch(error) {
    throw new Error('Template could not be read')
  }
  template = template.replace("{{name}}", `${firstName} ${lastName}`);
  template = template.replace("{{link_href}}", uri);
  return await sendEmail(email, 'Reset Password', template);
}

const readFile = (filePath: string): Promise<string> => {
  return new Promise(function(resolve, reject){
    fs.readFile(filePath, (err, data) => {
        err ? reject(err) : resolve(data.toString());
    });
  });
}