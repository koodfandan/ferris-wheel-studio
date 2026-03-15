type Locale = "zh" | "en";

export function ImportEntryButton({
  locale,
  onClick,
}: {
  locale: Locale;
  onClick: () => void;
}) {
  return (
    <button type="button" className="import-entry-button" onClick={onClick}>
      <span className="import-entry-icon">{locale === "zh" ? "3D" : "AI"}</span>
      <span className="import-entry-copy">
        <strong>{locale === "zh" ? "导入图片" : "Import Image"}</strong>
        <small>{locale === "zh" ? "用图片生成 3D 收藏品" : "Turn an image into a 3D collectible"}</small>
      </span>
    </button>
  );
}
