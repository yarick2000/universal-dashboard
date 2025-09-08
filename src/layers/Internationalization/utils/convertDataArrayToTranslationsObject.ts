export function convertDataArrayToTranslationsObject(
  keyField: string,
  valueField: string,
  data: Record<string, string>[],
): Record<string, Record<string, string> | string> {
  return data.reduce((acc, curr) => {
    const labels = (curr[keyField]).split('.');
    labels.reduce((nestedAcc, label, index) => {
      if (index === labels.length - 1) {
        nestedAcc[label] = curr[valueField];
      } else {
        nestedAcc[label] = nestedAcc[label] || {};
      }
      return nestedAcc[label] as Record<string, Record<string, string> | string>;
    }, acc);
    return acc;
  }, {} as Record<string, Record<string, string> | string>);
}
