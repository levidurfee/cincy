// ── Neighborhood data ──────────────────────────────────────────────────────
// priceMax: upper bound in $K for filter comparisons
// driveMin: driving minutes to 11511 Reed Hartman Hwy, Blue Ash, OH 45241
const neighborhoods = [
  {
    name: "Clifton",
    type: "Cincinnati Neighborhood",
    lat: 39.1501, lng: -84.5180,
    price: "$413K – $498K",
    priceMax: 498,
    crimeLevel: "moderate",
    crimeSummary: "C+ (Niche) — moderately safer than city avg",
    walkScore: 60,
    walkLabel: "Somewhat Walkable",
    driveMin: 22,
    community: [
      "Clifton Town Meeting — active monthly neighborhood council",
      "Clifton Plaza Farmers Market — every Monday on Ludlow Ave",
      "Annual Lantern Walk & House Tour",
      "Adjacent to Cincinnati Zoo & UC campus"
    ],
    color: "#e67e22"
  },
  {
    name: "Mariemont",
    type: "Village — Hamilton County",
    lat: 39.1443, lng: -84.3762,
    price: "$538K – $1.0M",
    priceMax: 1000,
    crimeLevel: "safe",
    crimeSummary: "A (Niche) — violent crime 75% below national avg",
    walkScore: 74,
    walkLabel: "Very Walkable",
    driveMin: 20,
    community: [
      "Farmers Market every Sunday, May–Oct (village square)",
      "The Barn arts center — exhibits, classes, kids' activities",
      "National Historic Landmark planned community (1920s)",
      "Mariemont Garden Club est. 1941; MariElders senior center"
    ],
    color: "#27ae60"
  },
  {
    name: "Northside",
    type: "Cincinnati Neighborhood",
    lat: 39.1563, lng: -84.5370,
    price: "$285K – $330K",
    priceMax: 330,
    crimeLevel: "elevated",
    crimeSummary: "C− (CrimeGrade) — elevated vs. national avg",
    walkScore: 67,
    walkLabel: "Somewhat Walkable",
    driveMin: 25,
    community: [
      "Year-round Farmers Market every Wednesday on Hamilton Ave",
      "Heart of Northside neighborhood organization",
      "Strong indie arts, music & LGBTQ+ community scene",
      "Annual block parties & local music events"
    ],
    color: "#c0392b"
  },
  {
    name: "Wyoming",
    type: "City — Hamilton County",
    lat: 39.2314, lng: -84.4664,
    price: "~$470K",
    priceMax: 470,
    crimeLevel: "safe",
    crimeSummary: "B+ (Niche) — safer than Cincinnati avg",
    walkScore: 30,
    walkLabel: "Car-Dependent",
    driveMin: 12,
    community: [
      "May Fete carnival — annual tradition since 1922",
      "Wyoming Fall Festival street fair on Wyoming Ave",
      "Summer Concert Series on the Village Green",
      "Active newcomers committee; school district ranked #7 in Ohio"
    ],
    color: "#27ae60"
  },
  {
    name: "Montgomery",
    type: "City — Hamilton County",
    lat: 39.2281, lng: -84.3541,
    price: "~$623K",
    priceMax: 623,
    crimeLevel: "safe",
    crimeSummary: "67% below national avg; violent crime 86% below avg",
    walkScore: 51,
    walkLabel: "Car-Dependent",
    driveMin: 10,
    community: [
      "Farmers Market every Saturday, May–Oct",
      "Bastille Day Celebration & Independence Day Parade",
      "Guided walking food tours of downtown Montgomery",
      "Johnson Nature Preserve with botanical walks"
    ],
    color: "#27ae60"
  },
  {
    name: "Madeira",
    type: "City — Hamilton County",
    lat: 39.1863, lng: -84.3677,
    price: "~$490K",
    priceMax: 490,
    crimeLevel: "safe",
    crimeSummary: "Property crime 79% below national avg; very safe",
    walkScore: 5,
    walkLabel: "Car-Dependent",
    driveMin: 9,
    community: [
      "Farmers Market every Thursday, May–mid-Dec (Dawson Rd)",
      "Independence Day Parade & Fireworks at McDonald Commons",
      "August Street Dance & Light-Up Madeira (Christmas)",
      "Named 'Best Suburb' in the Cincinnati region"
    ],
    color: "#27ae60"
  },
  {
    name: "St. Bernard",
    type: "Village — Hamilton County",
    lat: 39.1670, lng: -84.4986,
    price: "$165K – $191K",
    priceMax: 191,
    crimeLevel: "moderate",
    crimeSummary: "Mixed — at or above Ohio avg for its size; working-class enclave",
    walkScore: 57,
    walkLabel: "Somewhat Walkable",
    driveMin: 20,
    community: [
      "Famous Annual Soap Box Derby",
      "Parades, festivals & community picnics throughout the year",
      "Tower Park with sports fields, playgrounds & trails",
      "Tight-knit, friendly small-town feel (~3,900 residents)"
    ],
    color: "#e67e22"
  },
  {
    name: "Maineville",
    type: "Village — Warren County",
    lat: 39.3109, lng: -84.2070,
    price: "$343K – $375K",
    priceMax: 375,
    crimeLevel: "safe",
    crimeSummary: "Violent crime 80% below national avg; very safe",
    walkScore: 19,
    walkLabel: "Car-Dependent",
    driveMin: 22,
    community: [
      "Joint Freedom Parade & Festival (4th of July)",
      "Little Miami Scenic Trail — premier multi-use river trail",
      "Testerman Park & Marr Park (13 soccer fields)",
      "Fast-growing Warren County with highly rated schools"
    ],
    color: "#27ae60"
  },
  {
    name: "Deer Park",
    type: "City — Hamilton County",
    lat: 39.2058, lng: -84.3952,
    price: "$252K – $290K",
    priceMax: 290,
    crimeLevel: "safe",
    crimeSummary: "A+ (AreaVibes) — total crime 59% below national avg",
    walkScore: 73,
    walkLabel: "Very Walkable",
    driveMin: 7,
    community: [
      "Deer Park Market Gathering — 1st Sunday of month, May–Sep",
      "Chamberlin Park (13.5 ac) — Days in Park Festival & Party in the Park summer concerts",
      "Touch-A-Truck community event (Sep) & Easter Egg Hunt",
      "Walkable Blue Ash Rd corridor; ~5,400 residents, high home-ownership"
    ],
    color: "#27ae60"
  },
  {
    name: "Silverton",
    type: "Village — Hamilton County",
    lat: 39.1920, lng: -84.3950,
    price: "$282K – $297K",
    priceMax: 297,
    crimeLevel: "safe",
    crimeSummary: "A (AreaVibes) — total crime 49% below national avg",
    walkScore: 80,
    walkLabel: "Very Walkable",
    driveMin: 9,
    community: [
      "Taste of Silverton — annual June food & music festival",
      "Silverton Town Commons Summer Event Series — outdoor concerts",
      "Silverton Block Watch Association (Ohio's largest)",
      "Historic craftsman homes; National Civic League award winner"
    ],
    color: "#27ae60"
  },
  {
    name: "Reading",
    type: "City — Hamilton County",
    lat: 39.2248, lng: -84.4413,
    price: "$240K – $274K",
    priceMax: 274,
    crimeLevel: "moderate",
    crimeSummary: "B (AreaVibes) — violent crime 57% below national avg; moderate property crime",
    walkScore: 80,
    walkLabel: "Very Walkable",
    driveMin: 14,
    community: [
      "Reading Farmers Market — every Friday, June–September (Market St)",
      "Holiday Walk — December event with Santa, live Nativity & ice rink",
      "Running Scared 5K (October); Reading Parks Foundation est. 2002",
      "Walkable Market St corridor with shops & dining; tight-knit community"
    ],
    color: "#e67e22"
  },
  {
    name: "Bellevue",
    type: "City — Campbell County, KY",
    lat: 39.1060, lng: -84.4779,
    price: "$219K – $295K",
    priceMax: 295,
    crimeLevel: "safe",
    crimeSummary: "A+ (AreaVibes) — 29% below Kentucky avg; named 'Walk Friendly Community'",
    walkScore: 79,
    walkLabel: "Very Walkable",
    driveMin: 23,
    community: [
      "Bellevue Beach Park — Farmers Market (3rd Sunday Jul–Oct), Art in the Park & river concerts",
      "First Friday monthly events along Taylor & Fairfield Ave",
      "Named 'Most Charming City in Kentucky' by Southern Living magazine",
      "Historic Fairfield Ave with locally-owned shops, restaurants & indie bars"
    ],
    color: "#27ae60"
  },
  {
    name: "Morrow",
    type: "Village — Warren County",
    lat: 39.3534, lng: -84.1258,
    price: "$350K – $385K",
    priceMax: 385,
    crimeLevel: "safe",
    crimeSummary: "A+ (AreaVibes) — crime 72% below Ohio avg; very safe",
    walkScore: 26,
    walkLabel: "Car-Dependent",
    driveMin: 30,
    community: [
      "Little Miami River access — kayaking, fishing & scenic trails",
      "Little Miami Scenic Trail runs through town",
      "Small-town charm with Warren County school district",
      "Quiet rural setting with easy access to I-71"
    ],
    color: "#27ae60"
  }
];
