export const generateQualityCode = ({
  qualityAbbr,
  productCateg,
  denierPrefix,
  denier,
  filamentPrefix,
  filament,
  plyPrefix,
  ply,
  lustre,
  shadePrefix,
  shade,
  process,
  tpm,
  isLub,
}) => {
  const lubricated = "LUB";

  let finalProcess = process;
  const includeProcess = finalProcess !== "NIM";
  if (includeProcess) {
    if (finalProcess === "SIM") {
      finalProcess = "LIM";
    } else if (["TW", "HB", "TWHK"].includes(finalProcess)) {
      finalProcess = `${finalProcess}${tpm}`;
    }
    if (isLub) finalProcess = `${finalProcess}${lubricated}`;
  }

  const includePly = ply !== 1;
  const includeLustre = lustre !== "SD";
  const includeQuality = qualityAbbr !== "1ST";
  const includeShade = shadePrefix !== "RW";

  const qualityCodeParts = [
    productCateg,
    `${denierPrefix}${denier}`,
    `${filamentPrefix}${filament}`,
    includePly && `${plyPrefix}${ply}`,
    includeProcess && finalProcess,
    includeLustre && lustre,
    includeShade && `${shadePrefix}${shade}`,
    includeQuality && qualityAbbr,
  ];

  return qualityCodeParts.filter(Boolean).join("");
};
