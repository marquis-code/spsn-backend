const data = {
  title: '9th Annual International Scientific Conference/AGM',
  description: `THEME: Exploring the liver-pancreas axis: Intersecting pathways in development, disease and neoplasia

SUB THEMES:
1. Embryology to Oncology: Common Developmental Pathways (Hedgehog, Notch) Dysregulated in Congenital Disorders and Cancers.
2. Ampullary and Periampullary Tumours: A Multidisciplinary Approach to a Complex Anatomic Crossroads.
3. Metastatic Disease and Mimics: Differentiating Hepatocellular Carcinoma, Metastatic Colorectal Cancer, and Neuroendocrine Tumours in the Pancreas/Biliary Tree.
4. Systemic Diseases with Pancreatobiliary Manifestations: Sarcoidosis, Vasculitis, and Infectious Processes.
5. Beyond H&E: The Evolving Role of Ancillary Techniques (Immunohistochemistry Panels, FISH, Next-Generation Sequencing) on Small Biopsies and Cytology.
6. Bridging the Gap: Epidemiology and Diagnostic Challenges of Pancreatobiliary Diseases in Resource limited Settings.
7. Application of AI in Pancreatobiliary Disease Management.

ACCOUNT DETAILS:
SCPSN ACCOUNT
ACCESS BANK
0800585701
(Dollar account to be provided)

International Academy of Cytology (IAC) Comprehensive digital exams.
Mentorship commences April.

In collaboration with DEPARTMENT OF MEDICAL LABORATORY SCIENCE`,
  startDate: new Date('2026-07-15T08:00:00Z'),
  endDate: new Date('2026-07-18T18:00:00Z'),
  location: 'Prof Chikezie Edozien Secretariat, Asaba, Delta State',
  venue: 'Federal Medical Centre, Asaba',
  bannerImage: 'https://scpsn.org.ng/wp-content/uploads/2021/10/banner.jpg',
  status: 'upcoming',
  pricing: [
    { label: 'Nigeria', amount: 30000 },
    { label: 'Africa', amount: 50 },
    { label: 'Beyond Africa', amount: 100 }
  ],
  registrationOpen: true,
  abstractSubmissionOpen: true
};

fetch('http://127.0.0.1:3005/api/conferences', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(json => console.log('Response:', json))
.catch(err => console.error(err));
