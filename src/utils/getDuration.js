const getDuration = (dateStart, dateEnd) => {
  const durationMS = dateEnd - dateStart;

  if (durationMS <= 1_000) return `${durationMS}ms`;
  if (durationMS <= 60_000) return `${(durationMS / 1000).toFixed(2)}s`;
  if (durationMS <= 3_600_000) return `${(durationMS / 60000).toFixed(2)}m`;
  if (durationMS <= 86_400_000) return `${(durationMS / 3_600_000).toFixed(2)}h`;

  return `${(durationMS / 86_400_000).toFixed(2)}d`;
};

export default getDuration;
