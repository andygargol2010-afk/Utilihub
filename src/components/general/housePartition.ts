import * as THREE from "three";

/** Interior partition: thinner plaster leaf, room height, timber skirting — not an exterior wall. */
export function createPartitionMesh(mats: {
  wall: THREE.Material;
  nosing: THREE.Material;
  plate: THREE.Material;
}) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 0.1), mats.wall);
  body.position.y = 1.2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);
  for (const z of [-0.04, 0.04]) {
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.1, 0.04), mats.nosing);
    skirt.position.set(0, 0.05, z);
    skirt.castShadow = true;
    skirt.receiveShadow = true;
    group.add(skirt);
  }
  const head = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 0.12), mats.plate);
  head.position.y = 2.37;
  head.castShadow = true;
  head.receiveShadow = true;
  group.add(head);
  return group;
}
