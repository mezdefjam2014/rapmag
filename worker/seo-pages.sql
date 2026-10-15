-- SEO pass on the four information pages: cover alt text, excerpt, tags, and an internal link on each
UPDATE posts SET
 cover_alt='RAPMAG logo in white letters on a black background',
 dek='Learn about Rapaechelon, also known as RAPMAG, an independent U.S. publication covering hip-hop, rap, entertainment, culture, breaking news and emerging artists.',
 tags='Rapaechelon, RAPMAG, Rap Aechelon Mag, about, hip-hop news, independent publication',
 body=REPLACE(body,'distinguishing news reporting from commentary and promotional material.','distinguishing news reporting from commentary and promotional material, as set out in our <a href="https://mezdefjam2014.github.io/rapmag/page/editorial-standards/" target="_blank" rel="noopener">Editorial Standards</a>.')
WHERE slug='about';
UPDATE posts SET
 cover_alt='RAPMAG logo in white letters on a black background',
 dek='How Rapaechelon (RAPMAG) reports: accuracy, attribution, honest headlines, unaltered quotes, and a clear line between news, opinion and sponsored content.',
 tags='Rapaechelon, RAPMAG, editorial standards, journalism ethics, accuracy, attribution',
 body=REPLACE(body,'Corrections should follow our Corrections Policy.','Corrections should follow our <a href="https://mezdefjam2014.github.io/rapmag/page/corrections-policy/" target="_blank" rel="noopener">Corrections Policy</a>.')
WHERE slug='editorial-standards';
UPDATE posts SET
 cover_alt='RAPMAG logo in white letters on a black background',
 dek='How Rapaechelon (RAPMAG) corrects factual errors, handles updates to developing stories, and reviews reader requests about published articles.',
 tags='Rapaechelon, RAPMAG, corrections policy, accuracy, updates, reader requests',
 body=REPLACE(body,'Readers who believe an article contains an error may contact Rapaechelon','Readers who believe an article contains an error may <a href="https://mezdefjam2014.github.io/rapmag/page/contact/" target="_blank" rel="noopener">contact Rapaechelon</a>')
WHERE slug='corrections-policy';
UPDATE posts SET
 cover_alt='RAPMAG logo in white letters on a black background',
 dek='Contact Rapaechelon (RAPMAG) with news tips, corrections, story ideas, music submissions or business inquiries at rapaechelon@gmail.com.',
 tags='Rapaechelon, RAPMAG, contact, news tips, music submissions, corrections',
 body=REPLACE(body,'When submitting a correction, include','When submitting a correction (see our <a href="https://mezdefjam2014.github.io/rapmag/page/corrections-policy/" target="_blank" rel="noopener">Corrections Policy</a>), include')
WHERE slug='contact';
