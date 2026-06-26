import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be a 6-digit number'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20)
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/,
      'Must contain uppercase, lowercase, digit, and special character (@#$%^&+=!)'
    ),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters').max(100),
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20)
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/,
      'Password must contain uppercase, lowercase, digit, and special character'
    ),
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number starting with 6-9'),
})

export const productSchema = z.object({
  productName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  productType: z.enum(['HEALTH', 'MOTOR', 'LIFE', 'TRAVEL'], {
    errorMap: () => ({ message: 'Select a valid product type' }),
  }),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  active: z.boolean(),
})

export const planSchema = z.object({
  productId: z.number({ invalid_type_error: 'Product is required' }).int().positive('Product is required'),
  planName: z.string().min(3, 'Plan name must be at least 3 characters').max(100),
  coverageAmount: z.number({ invalid_type_error: 'Coverage amount is required' }).positive('Coverage amount must be > 0'),
  premiumAmount: z.number({ invalid_type_error: 'Premium amount is required' }).positive('Premium amount must be > 0'),
  premiumType: z.enum(['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUAL'], {
    errorMap: () => ({ message: 'Select a valid premium type (MONTHLY, QUARTERLY, HALF_YEARLY, ANNUAL)' }),
  }),
  duration: z.number({ invalid_type_error: 'Duration is required' }).int().min(1, 'Duration must be at least 1'),
  termsAndConditions: z.string().min(10, 'Terms must be at least 10 characters').max(2000),
  active: z.boolean(),
})

export const paymentSchema = z.object({
  policyPlanId: z.number({ invalid_type_error: 'Plan ID is required' }).int().positive(),
  amount: z.number({ invalid_type_error: 'Amount is required' }).positive('Amount must be > 0'),
  policyNumber: z.string().min(5, 'Policy number is required').max(30),
  paymentMode: z.enum(['UPI', 'CARD', 'NET_BANKING', 'CASH'], {
    errorMap: () => ({ message: 'Select a valid payment mode' }),
  }),
})

export const issuePolicySchema = z.object({
  customerId: z.number({ invalid_type_error: 'Customer ID is required' }).int().positive(),
  planId: z.number({ invalid_type_error: 'Plan is required' }).int().positive(),
  startDate: z.string().min(1, 'Start date is required'),
})

const documentSchema = z.object({
  file: z
    .any()
    .refine((files) => files?.length === 1, 'Select a document'),
})

export const raiseClaimSchema = z.object({
  policyId: z.number({ invalid_type_error: 'Policy is required' }).int().positive(),
  claimAmount: z.number({ invalid_type_error: 'Claim amount is required' }).positive('Claim amount must be > 0'),
  claimReason: z.string().min(10, 'Describe the reason in at least 10 characters').max(1000),
  incidentDate: z.string().min(1, 'Incident date is required'),
  documents: z.array(documentSchema).min(1, 'At least one document is required').max(10),
})

export const reviewClaimSchema = z.object({
  recommended: z.preprocess((value) => {
    if (value === 'true') return true
    if (value === 'false') return false
    return value
  }, z.boolean({ invalid_type_error: 'Select a recommendation' })),
  remarks: z.string().min(5, 'Remarks must be at least 5 characters'),
})

export const customerProfileSchema = z.object({
  nomineeName: z.string().min(2, 'Nominee name required').max(50),
  nomineeRelation: z.string().min(1, 'Nominee relation required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(5, 'Address required').max(150),
  city: z.string().min(1, 'City required'),
  state: z.string().min(1, 'State required'),
  pinCode: z.string().regex(/^[1-9][0-9]{5}$/, 'Enter a valid 6-digit pin code'),
})
