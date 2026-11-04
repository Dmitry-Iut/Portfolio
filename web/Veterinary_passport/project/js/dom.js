function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (key in node) {
      node[key] = value;
    } else {
      node.setAttribute(key, value); 
    }
  }

  node.append(
    ...children.flat().filter((child) => child != null && child !== false),
  );
  return node;
}
