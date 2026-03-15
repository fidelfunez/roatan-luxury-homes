import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getContentField, getWebsiteContent } from './contentUtils';

export const useContent = () => {
  const { i18n } = useTranslation();
  const [, forceUpdate] = useState(0);
  const lang = i18n.language === 'es' ? 'es' : 'en';

  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1);
    window.addEventListener('websiteContentUpdated', handler);
    return () => window.removeEventListener('websiteContentUpdated', handler);
  }, []);

  const content = getWebsiteContent();

  const getContent = (page, section, field, fallback = '') => {
    const fieldKey = lang === 'es' ? field + 'Es' : field;
    let value;
    if (section === '') {
      value = content[page]?.[fieldKey];
    } else {
      value = content[page]?.[section]?.[fieldKey];
    }
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return getContentField(page, section, field, lang) || fallback;
    }
    return value;
  };

  return { getContent, lang };
};
