import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast';
import { getUserSession } from '@/lib/core/session';

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  const user = await getUserSession();
  // console.log(user?.isPremium);

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status,
    customer_details: { email: customerEmail },
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items']
  })

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete') {
    // update the user table about the new premium
    const subInfo = {
      email: customerEmail,
      isPremium: true,
    }

    // 1. Post to your Express backend using fetch
    try {
      // check user is premium true then return
      if (user?.isPremium) {
        return redirect('/');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subInfo)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Successfully upgraded premium package!");
      } else {
        toast.error("Failed to upgrade.");
      }
    } catch (err) {
      console.log("Something wrong", err);
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full bg-card rounded-2xl border border-border shadow-xl p-8 text-center space-y-6">

          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success/10 text-success">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
            <p className="text-muted">
              We appreciate your business! A confirmation email has been sent to{' '}
              <span className="font-semibold text-foreground">{customerEmail}</span>.
            </p>
          </div>

          {/* Support Link */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted">
              Questions? Email us at{' '}
              <a href="mailto:orders@example.com" className="text-primary hover:text-primary-hover underline font-medium">
                orders@example.com
              </a>
            </p>
          </div>

          {/* Home Button */}
          <Link
            href="/"
            className="block w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }
}