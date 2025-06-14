import ContactForm from '@/components/contact/contact-form';
import PageHeader from '@/components/page-header';

export default function Contact() {
  return (
    <div className="container py-12">
      <PageHeader
        title="Contact Me"
        breadcrumbs={[{ label: 'Contact', href: '/contact' }]}
      />
      <ContactForm />
    </div>
  );
}
