export default {
  loadingShading: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, .3)',
  } as const,
  loadingIcon: {
    position: 'absolute',
    fontSize: 20,
    top: 'calc(45% - 10px)',
    left: 'calc(50% - 10px)',
  } as const,
};
