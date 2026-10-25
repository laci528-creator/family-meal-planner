import { useTheme } from "./useTheme";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      aria-label="Choose color theme"
    >
      <option value="green">Natural Green</option>
      <option value="blue">Ocean Blue</option>
    </select>
  );
}