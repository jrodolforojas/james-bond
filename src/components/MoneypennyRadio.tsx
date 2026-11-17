import { forwardRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface MoneypennyRadioProps {
  children: ReactNode;
  speaker?: string;
}

export const MoneypennyRadio = forwardRef<HTMLDivElement, MoneypennyRadioProps>(function MoneypennyRadio(
  { children, speaker },
  ref,
) {
  const { t } = useTranslation();
  return (
    <div className="radio" ref={ref} role="status">
      <div className="radio__header" aria-hidden="true">
        <span className="radio__led" />
        <span>{speaker ?? t('moneypenny')}</span>
        <span className="radio__wave">
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
      </div>
      <p className="radio__text">{children}</p>
    </div>
  );
});
