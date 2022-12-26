export const shortAddr = (addr) => {
  if (!addr) return addr;
  return `${addr.substr(0, 4)}...${addr.substring(
    addr.length - 4,
    addr.length
  )}`;
};
