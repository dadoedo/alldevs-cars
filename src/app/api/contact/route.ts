import { NextRequest, NextResponse } from 'next/server';
import { sendContactForm } from '@/lib/email';
import { ContactFormData } from '@/types';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Meno je povinné'),
  email: z.string().email('Neplatný email'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Správa musí mať aspoň 10 znakov'),
  carId: z.number().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = contactSchema.parse(body);
    
    // Send email
    await sendContactForm(validatedData as ContactFormData);
    
    return NextResponse.json({ message: 'Správa bola úspešne odoslaná' });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Neplatné údaje', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Error sending contact form:', error);
    return NextResponse.json(
      { error: 'Nepodarilo sa odoslať správu' },
      { status: 500 }
    );
  }
}
