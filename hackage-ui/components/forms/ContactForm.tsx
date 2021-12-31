import s from './ContactForm.module.css';
import { useState } from 'react';
import Textarea from './Textarea';
import Input from './Input';
import Button from './Button';

const ContactForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div>
      <h3 style={{ color: 'var(--purple-color-2)' }}>Ask a Question</h3>
      <div className={s.formGroup}>
        <h4 className={s.formGroupLabel}>Your Email</h4>
        <Input value={email} placeholder="abc@xyz" onChange={setEmail} />
      </div>

      <div className={s.formGroup}>
        <h4 className={s.formGroupLabel}>Message</h4>
        <Textarea value={message} onChange={setMessage} placeholder="abc@xyz" rows={10} />
      </div>

      <Button onClick={() => { }} text='Send' type='regularButton' />
    </div>
  )
}

export default ContactForm;
