import { useTranslation } from 'react-i18next';

export const useLocalizedProperty = () => {
  const { i18n } = useTranslation();
  const isSpanish = i18n.language === 'es';

  const getTitle = (property) => {
    if (!property) return '';
    return (isSpanish && property.titleEs) ? property.titleEs : (property.title || '');
  };

  const getDescription = (property) => {
    if (!property) return '';
    return (isSpanish && property.descriptionEs) ? property.descriptionEs : (property.description || '');
  };

  const getLocation = (property) => {
    if (!property) return '';
    return (isSpanish && property.locationEs) ? property.locationEs : (property.location || '');
  };

  return { getTitle, getDescription, getLocation, isSpanish };
};
