This file contains the info about the changes and the approach on how am i going to improve the payments

this is the folder structure 
api/
├── single-course/
│       ├── create-order/
│       │   └── route.ts          ← NEW: Secure order creation
│       └── verify/
│           └── route.ts          ← NEW: Payment verification
│
├── pricing/                      ← EXISTING: Keep as is (reuse)
│   └── [course]/
│       └── route.ts
│
├── validate-coupon/              ← EXISTING: Keep as is (reuse)
│   └── route.ts
│
└── config/                       ← EXISTING: Keep as is (reuse)
    └── route.ts