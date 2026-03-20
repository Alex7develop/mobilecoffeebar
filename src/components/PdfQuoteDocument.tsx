import { t } from '../app/i18n';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const EVENT_TYPE_MAP: Record<string, string> = {
  'Свадьба': 'Свадьба',
  'Wedding': 'Свадьба',
  'День Рождения': 'День Рождения',
  'Birthday': 'День Рождения',
  'Корпоратив': 'Корпоратив',
  'Corporate': 'Корпоратив',
  'Частное мероприятие': 'Частное мероприятие',
  'Private event': 'Частное мероприятие',
  'Деловое мероприятие': 'Деловое мероприятие',
  'Business event': 'Деловое мероприятие',
  'Маркетинговое и PR-мероприятие': 'Маркетинговое и PR-мероприятие',
  'Marketing & PR event': 'Маркетинговое и PR-мероприятие',
  'Другое': 'Другое',
  'Other': 'Другое',
};

function formatDateRu(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export interface PdfQuoteProps {
  recommendedPackage: string;
  guests: number;
  hours: number;
  barista: number;
  eventDate: string;
  eventType: string;
  city: string;
  selectedMilk: string[];
  signatureSelected: string[];
  optDrink: boolean;
  optFunctional: boolean;
  optStandCustom: boolean;
  optMasterclass: boolean;
  optMoreMilks: boolean;
}

export function createPdfHtml(props: PdfQuoteProps & { mobile?: boolean }): string {
  const eventTypeRu = EVENT_TYPE_MAP[props.eventType] ?? props.eventType;
  const cityEntry = (t.calc.cities as Record<string, { ru: string }>)[props.city];
  const cityRu = cityEntry ? cityEntry.ru : props.city;

  const milkNames = props.selectedMilk
    .map((id) => {
      const m = t.milkTypes.find((x) => x.id === id);
      return m ? m.ru : id;
    })
    .filter(Boolean);

  const moreOptions: string[] = [];
  if (props.optDrink) moreOptions.push('Напиток события');
  if (props.optFunctional) moreOptions.push('Функциональные напитки');
  if (props.optStandCustom) moreOptions.push('Кастомизация модульной стойки под мероприятие');
  if (props.optMasterclass) moreOptions.push('Мастер-класс: Анатомия Вкуса');
  if (props.optMoreMilks) moreOptions.push('Более 4-х видов молока');

  const width = props.mobile ? '100%' : '420px';
  const padding = props.mobile ? '32px 24px' : '48px 40px';
  const minHeight = props.mobile ? 'auto' : '520px';
  return `<div style="
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  padding: ${padding};
  background: #F8F7F5;
  color: #2A2A2A;
  width: ${width};
  min-height: ${minHeight};
  box-sizing: border-box;
">
  <div style="border-bottom: 2px solid #E8520A; padding-bottom: 16px; margin-bottom: 28px;">
    <div style="font-size: 9px; letter-spacing: 4px; color: #E8520A; text-transform: uppercase; margin-bottom: 6px;">Рекомендуемый пакет</div>
    <div style="font-size: 32px; font-weight: 300; margin-bottom: 4px;">${esc(props.recommendedPackage)}</div>
    <div style="font-size: 11px; color: #6B6B6B; letter-spacing: 1px;">${props.guests} гостей · ${props.hours} ч работы бара · ${props.barista} бариста</div>
  </div>

  <div style="margin-bottom: 20px;">
    <div style="font-size: 9px; letter-spacing: 3px; color: #E8520A; text-transform: uppercase; margin-bottom: 8px;">Мероприятие</div>
    <div style="font-size: 12px; line-height: 1.6;">${esc(formatDateRu(props.eventDate))} · ${esc(eventTypeRu)} · ${esc(cityRu)}</div>
  </div>

  <div style="font-size: 9px; letter-spacing: 3px; color: #E8520A; text-transform: uppercase; margin-bottom: 12px;">В пакет включено</div>

  <div style="margin-bottom: 16px;">
    <div style="font-size: 11px; line-height: 1.6; color: #2A2A2A;">Классика кофейного бара включена: эспрессо, американо, капучино, латте, флэт уайт.</div>
  </div>

  ${milkNames.length > 0 ? `
  <div style="margin-bottom: 16px;">
    <div style="font-size: 9px; letter-spacing: 2px; color: #8A8A8A; text-transform: uppercase; margin-bottom: 6px;">Виды молока</div>
    <div style="font-size: 11px; line-height: 1.6;">${esc(milkNames.join(', '))}</div>
  </div>
  ` : ''}

  ${props.signatureSelected.length > 0 ? `
  <div style="margin-bottom: 16px;">
    <div style="font-size: 9px; letter-spacing: 2px; color: #8A8A8A; text-transform: uppercase; margin-bottom: 6px;">Дополнительные позиции</div>
    <div style="font-size: 11px; line-height: 1.6;">${esc(props.signatureSelected.join(', '))}</div>
  </div>
  ` : ''}

  ${moreOptions.length > 0 ? `
  <div style="margin-bottom: 16px;">
    <div style="font-size: 9px; letter-spacing: 2px; color: #8A8A8A; text-transform: uppercase; margin-bottom: 8px;">Больше возможностей</div>
    <div style="font-size: 11px; line-height: 1.8;">
      ${moreOptions.map(o => `<div style="margin-bottom: 2px;">· ${esc(o)}</div>`).join('')}
    </div>
  </div>
  ` : ''}

  <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(42,42,42,0.1); text-align: center; font-size: 9px; color: #8A8A8A; letter-spacing: 1px;">
    НЕО · Архитектура кофейного опыта<br/>
    Финальная стоимость подтверждается после брифинга
  </div>
</div>`;
}
