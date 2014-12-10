var observer = {};

function removeContainer(name) {
  if (observer['containers'] === undefined) {
    observer['containers'] = {};
  }

  delete observer['containers'][name];
}

function removeField(container, name) {
  if (observer['containers'] === undefined) {
    observer['containers'] = {};
  }

  delete observer.containers[container].fields[name];
}
