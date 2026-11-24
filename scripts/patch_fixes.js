import fs from 'fs';

let ldp = fs.readFileSync('src/features/leads/pages/LeadDetailPage.tsx', 'utf8');
ldp = ldp.replace('const [editForm, setEditForm] = useState<Record<string, unknown>>({});', 'const [editForm, setEditForm] = useState<Partial<LeadDetail>>({});');
ldp = ldp.replaceAll('onChange={(e) => setEditForm((p: Record<string, unknown>) => ({ ...p,', 'onChange={(e) => setEditForm((p: Partial<LeadDetail>) => ({ ...p,');
fs.writeFileSync('src/features/leads/pages/LeadDetailPage.tsx', ldp, 'utf8');

console.log('LeadDetailPage patched with Partial<LeadDetail>');
