const colors = {
  magenta: '#eb2f96',
  red: '#f5222d',
  volcano: '#fa541c',
  orange: '#fa8c16',
  gold: '#faad14',
  lime: '#a0d911',
  green: '#52c41a',
  cyan: '#13c2c2',
  blue: '#1890ff',
  geekblue: '#2f54eb',
  purple: '#722ed1',
  black: '#000',
};

export default function Highlight({ color, children, style }) {
  const styles = { color: colors[color] || color, ...style };
  return <span style={styles}>{children}</span>;
}
