// src/components/QuoteHeader.jsx
import { BodoLogo } from './shared/BodoLogo.jsx';
import { EditableText } from './shared/EditableText.jsx';

export const QuoteHeader = ({ header, setHeader }) => {
  const set = (k) => (v) => setHeader({ ...header, [k]: v });
  const rows = [
    ['Offert:',  'offerNumber',     'Nr 5/2026',          false],
    ['Datum:',   'date',            '20.02.2026',         false],
    ['Kund:',    'customerName',    'Imię nazwisko',      false],
    ['Adress:',  'customerAddress', 'ul., kod, miasto',   true],
    ['Projekt:', 'projectName',     'Nazwa projektu',     false],
  ];
  return (
    <div className="flex justify-between items-start mb-10 gap-6">
      <table className="text-[15px]" style={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
        <tbody>
          {rows.map(([label, key, ph, multi]) => (
            <tr key={key}>
              <td className="font-bold align-top pr-4 whitespace-nowrap" style={{ width: 90 }}>{label}</td>
              <td className="align-top" style={{ minWidth: 260 }}>
                <EditableText
                  as="div"
                  value={header[key]}
                  onChange={set(key)}
                  placeholder={ph}
                  multiline={multi}
                  className="block"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <BodoLogo size="md" />
    </div>
  );
};
