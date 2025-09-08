import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function LocalizedHomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations('application');
  setRequestLocale(locale);

  return <h1>{t('title')}</h1>;
}
