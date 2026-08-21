const CharCount = ({ value, max }: { value: string; max: number }) => {
  const over = value.length > max;
  return (
    <span className={`text-xs tabular-nums ${over ? "text-red-600" : "text-zinc-400"}`}>
      {value.length}/{max}
    </span>
  );
}

export default CharCount;
