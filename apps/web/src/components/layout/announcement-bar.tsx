import Link from 'next/link';

export function AnnouncementBar() {
  return (
    <div className="bg-accent text-white text-center text-xs sm:text-sm py-2.5 px-4">
      <p className="leading-relaxed">
        <span className="font-semibold">Dimaker is becoming Dalim!</span>{' '}
        I&apos;m creating Designs for the Designers. Clean systems, beautiful
        interfaces, and thoughtful details — made for you.{' '}
        <Link href="/" className="underline underline-offset-2 font-medium hover:opacity-90">
          Visit Dalim
        </Link>
      </p>
    </div>
  );
}
