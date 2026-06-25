import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status,
    customer_details: { email: customerEmail }
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items']
  })

  if (status === 'open') {
    return redirect('/')
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