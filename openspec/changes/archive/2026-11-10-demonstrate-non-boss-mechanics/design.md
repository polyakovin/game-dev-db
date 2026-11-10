## Scene contracts

- `movement-platforming--t003`: approach the edge, jump across a gap and
  plant both feet within the landing surface.
- `melee-combat--t016`: an ordinary sparring opponent thrusts. The weapon
  reaches the defense plane inside a half-open parry window, then rebounds.
- `stealth-infiltration--t031`: a stationary guard can see the player in
  the field of view until a wall crosses the line of sight.
- `shooting-projectiles--t029`: the player retreats left while firing right.
  Shots originate from the weapon and aim remains fixed when movement stops.
- `social-cooperation--t204`: one player holds a switch while another crosses
  the bridge it extends. The operator leaves after the traveler returns.

The SVG uses the same atlas rig and stable per-scene nodes. The server and
browser sample the same pure model. Give actors the roles used in the scene.
Use the pinned artwork source for attribution. Avoid shipping old boss models
that no card uses. Existing screenshots and v1 fields remain compatible.
