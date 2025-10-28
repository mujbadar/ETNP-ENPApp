import React from "react";

const NeighborhoodMap = ({ className = "", ...props }) => {
  return (
    <svg
      viewBox="0 0 800 600"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Background */}
      <rect width="800" height="600" fill="#f8f9fa" />

      {/* Neighborhood boundary (red outline from map) */}
      <path
        d="M 50 50 L 50 200 L 120 280 L 180 350 L 220 420 L 280 480 L 350 520 L 750 520 L 750 50 Z"
        fill="rgba(43, 57, 144, 0.05)"
        stroke="#2B3990"
        strokeWidth="3"
        strokeDasharray="8,4"
      />

      {/* Major Streets - Horizontal */}
      {/* W Lovers Ln */}
      <line x1="50" y1="80" x2="750" y2="80" stroke="#666" strokeWidth="2" />
      <text x="60" y="75" fontSize="12" fill="#666" fontWeight="500">
        W Lovers Ln
      </text>

      {/* Kelton Dr */}
      <line
        x1="180"
        y1="120"
        x2="600"
        y2="120"
        stroke="#666"
        strokeWidth="1.5"
      />
      <text x="190" y="115" fontSize="11" fill="#666">
        Kelton Dr
      </text>

      {/* Hopkins Ave */}
      <line
        x1="120"
        y1="180"
        x2="550"
        y2="180"
        stroke="#666"
        strokeWidth="1.5"
      />
      <text x="130" y="175" fontSize="11" fill="#666">
        Hopkins Ave
      </text>

      {/* March Ave */}
      <line x1="180" y1="220" x2="500" y2="220" stroke="#666" strokeWidth="1" />
      <text x="190" y="215" fontSize="10" fill="#666">
        March Ave
      </text>

      {/* Cowan Ave */}
      <line x1="180" y1="260" x2="500" y2="260" stroke="#666" strokeWidth="1" />
      <text x="190" y="255" fontSize="10" fill="#666">
        Cowan Ave
      </text>

      {/* W University Blvd */}
      <line x1="220" y1="320" x2="650" y2="320" stroke="#666" strokeWidth="2" />
      <text x="230" y="315" fontSize="12" fill="#666" fontWeight="500">
        W University Blvd
      </text>

      {/* Thedford Ave */}
      <line x1="280" y1="420" x2="550" y2="420" stroke="#666" strokeWidth="1" />
      <text x="290" y="415" fontSize="10" fill="#666">
        Thedford Ave
      </text>

      {/* Wenonah Dr */}
      <line x1="450" y1="360" x2="650" y2="360" stroke="#666" strokeWidth="1" />
      <text x="460" y="355" fontSize="10" fill="#666">
        Wenonah Dr
      </text>

      {/* Waneta Dr */}
      <line x1="450" y1="400" x2="650" y2="400" stroke="#666" strokeWidth="1" />
      <text x="460" y="395" fontSize="10" fill="#666">
        Waneta Dr
      </text>

      {/* Thrush St */}
      <line x1="350" y1="280" x2="550" y2="280" stroke="#666" strokeWidth="1" />
      <text x="360" y="275" fontSize="10" fill="#666">
        Thrush St
      </text>

      {/* Linnet Ln */}
      <line x1="350" y1="300" x2="500" y2="300" stroke="#666" strokeWidth="1" />
      <text x="360" y="295" fontSize="10" fill="#666">
        Linnet Ln
      </text>

      {/* Stigall St */}
      <line x1="120" y1="140" x2="400" y2="140" stroke="#666" strokeWidth="1" />
      <text x="130" y="135" fontSize="10" fill="#666">
        Stigall St
      </text>

      {/* Newmore Ave */}
      <line x1="180" y1="100" x2="400" y2="100" stroke="#666" strokeWidth="1" />
      <text x="190" y="95" fontSize="10" fill="#666">
        Newmore Ave
      </text>

      {/* W Mockingbird Ln */}
      <line x1="280" y1="520" x2="750" y2="520" stroke="#666" strokeWidth="2" />
      <text x="290" y="515" fontSize="12" fill="#666" fontWeight="500">
        W Mockingbird Ln
      </text>

      {/* Major Streets - Vertical */}
      {/* S Cockrell Hill Rd */}
      <line x1="50" y1="50" x2="50" y2="200" stroke="#666" strokeWidth="2" />
      <text
        x="25"
        y="120"
        fontSize="11"
        fill="#666"
        transform="rotate(-90, 25, 120)"
      >
        S Cockrell Hill Rd
      </text>

      {/* Lemmon Ave (diagonal) */}
      <line x1="50" y1="200" x2="180" y2="350" stroke="#666" strokeWidth="2" />
      <text
        x="90"
        y="270"
        fontSize="11"
        fill="#666"
        transform="rotate(-50, 90, 270)"
      >
        Lemmon Ave
      </text>

      {/* Inwood Rd (diagonal) */}
      <line x1="180" y1="350" x2="280" y2="480" stroke="#666" strokeWidth="2" />
      <text
        x="200"
        y="410"
        fontSize="11"
        fill="#666"
        transform="rotate(-50, 200, 410)"
      >
        Inwood Rd
      </text>

      {/* Roper St */}
      <line x1="350" y1="50" x2="350" y2="220" stroke="#666" strokeWidth="1" />
      <text
        x="325"
        y="130"
        fontSize="10"
        fill="#666"
        transform="rotate(-90, 325, 130)"
      >
        Roper St
      </text>

      {/* Linwood Ave */}
      <line x1="450" y1="50" x2="450" y2="320" stroke="#666" strokeWidth="1" />
      <text
        x="425"
        y="180"
        fontSize="10"
        fill="#666"
        transform="rotate(-90, 425, 180)"
      >
        Linwood Ave
      </text>

      {/* Robin Rd */}
      <line
        x1="650"
        y1="50"
        x2="650"
        y2="520"
        stroke="#666"
        strokeWidth="1.5"
      />
      <text
        x="625"
        y="280"
        fontSize="11"
        fill="#666"
        transform="rotate(-90, 625, 280)"
      >
        Robin Rd
      </text>

      {/* Kaywood Dr */}
      <line x1="550" y1="50" x2="550" y2="400" stroke="#666" strokeWidth="1" />
      <text
        x="525"
        y="220"
        fontSize="10"
        fill="#666"
        transform="rotate(-90, 525, 220)"
      >
        Kaywood Dr
      </text>

      {/* Oriole Dr */}
      <line x1="600" y1="50" x2="600" y2="450" stroke="#666" strokeWidth="1" />
      <text
        x="575"
        y="250"
        fontSize="10"
        fill="#666"
        transform="rotate(-90, 575, 250)"
      >
        Oriole Dr
      </text>

      {/* Callist Dr */}
      <line x1="500" y1="50" x2="500" y2="360" stroke="#666" strokeWidth="1" />
      <text
        x="475"
        y="200"
        fontSize="10"
        fill="#666"
        transform="rotate(-90, 475, 200)"
      >
        Callist Dr
      </text>

      {/* Motron Dr */}
      <line x1="700" y1="120" x2="700" y2="520" stroke="#666" strokeWidth="1" />
      <text
        x="675"
        y="320"
        fontSize="10"
        fill="#666"
        transform="rotate(-90, 675, 320)"
      >
        Motron Dr
      </text>

      {/* Inwood Drive - Eastern boundary */}
      <line x1="780" y1="50" x2="780" y2="550" stroke="#666" strokeWidth="2" />
      <text
        x="755"
        y="300"
        fontSize="12"
        fill="#666"
        fontWeight="500"
        transform="rotate(-90, 755, 300)"
      >
        Inwood Dr
      </text>

      {/* Additional cross streets */}
      {/* Locksley Ave */}
      <line x1="550" y1="200" x2="700" y2="200" stroke="#666" strokeWidth="1" />
      <text x="560" y="195" fontSize="10" fill="#666">
        Locksley Ave
      </text>

      {/* Wren Way */}
      <line x1="450" y1="440" x2="650" y2="440" stroke="#666" strokeWidth="1" />
      <text x="460" y="435" fontSize="10" fill="#666">
        Wren Way
      </text>

      {/* Lark Ln */}
      <line x1="500" y1="480" x2="650" y2="480" stroke="#666" strokeWidth="1" />
      <text x="510" y="475" fontSize="10" fill="#666">
        Lark Ln
      </text>

      {/* Additional residential streets */}

      {/* Wateka Dr */}
      <line x1="450" y1="240" x2="650" y2="240" stroke="#666" strokeWidth="1" />
      <text x="460" y="235" fontSize="10" fill="#666">
        Wateka Dr
      </text>

      {/* Glenwick Ln */}
      <line x1="600" y1="160" x2="750" y2="160" stroke="#666" strokeWidth="1" />
      <text x="610" y="155" fontSize="10" fill="#666">
        Glenwick Ln
      </text>

      {/* Boaz St */}
      <line x1="650" y1="100" x2="780" y2="100" stroke="#666" strokeWidth="1" />
      <text x="660" y="95" fontSize="10" fill="#666">
        Boaz St
      </text>

      {/* Longfellow Ave */}
      <line x1="550" y1="160" x2="700" y2="160" stroke="#666" strokeWidth="1" />
      <text x="560" y="155" fontSize="10" fill="#666">
        Longfellow Ave
      </text>

      {/* Grace Dr */}
      <line x1="400" y1="50" x2="400" y2="280" stroke="#666" strokeWidth="1" />
      <text
        x="375"
        y="160"
        fontSize="10"
        fill="#666"
        transform="rotate(-90, 375, 160)"
      >
        Grace Dr
      </text>

      {/* Kenwell St */}
      <line x1="320" y1="140" x2="500" y2="140" stroke="#666" strokeWidth="1" />
      <text x="330" y="135" fontSize="10" fill="#666">
        Kenwell St
      </text>

      {/* Prosper St */}
      <line x1="280" y1="340" x2="450" y2="340" stroke="#666" strokeWidth="1" />
      <text x="290" y="335" fontSize="10" fill="#666">
        Prosper St
      </text>

      {/* Intersections - major points */}
      <circle cx="350" cy="180" r="3" fill="#2B3990" />
      <circle cx="450" cy="320" r="3" fill="#2B3990" />
      <circle cx="180" cy="350" r="3" fill="#2B3990" />
      <circle cx="280" cy="480" r="3" fill="#2B3990" />
      <circle cx="550" cy="200" r="2" fill="#2B3990" />
      <circle cx="600" cy="360" r="2" fill="#2B3990" />
      <circle cx="450" cy="240" r="2" fill="#2B3990" />
      <circle cx="650" cy="160" r="2" fill="#2B3990" />
      <circle cx="400" cy="140" r="2" fill="#2B3990" />

      {/* Points of Interest */}
      {/* Love Field area indicator */}
      <rect
        x="80"
        y="140"
        width="60"
        height="30"
        rx="4"
        fill="rgba(43, 57, 144, 0.1)"
        stroke="#2B3990"
        strokeWidth="1"
        strokeDasharray="2,2"
      />
      <text x="110" y="158" fontSize="9" fill="#2B3990" textAnchor="middle">
        Love Field
      </text>

      {/* Frontiers of Flight Museum */}
      <circle cx="200" cy="400" r="6" fill="#2B3990" opacity="0.7" />
      <text x="210" y="405" fontSize="9" fill="#2B3990">
        Museum
      </text>

      {/* Compass */}
      <g transform="translate(720, 80)">
        <circle
          cx="0"
          cy="0"
          r="25"
          fill="white"
          stroke="#666"
          strokeWidth="1"
        />
        <path d="M 0,-20 L 5,0 L 0,20 L -5,0 Z" fill="#2B3990" />
        <text x="0" y="-35" fontSize="10" fill="#666" textAnchor="middle">
          N
        </text>
      </g>

      {/* Scale indicator */}
      <g transform="translate(50, 570)">
        <line x1="0" y1="0" x2="100" y2="0" stroke="#666" strokeWidth="2" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke="#666" strokeWidth="2" />
        <line x1="100" y1="-3" x2="100" y2="3" stroke="#666" strokeWidth="2" />
        <text x="50" y="-8" fontSize="10" fill="#666" textAnchor="middle">
          0.5 mi
        </text>
      </g>

      {/* Neighborhood label */}
      <text
        x="400"
        y="250"
        fontSize="18"
        fill="#2B3990"
        fontWeight="600"
        textAnchor="middle"
      >
        West Inwood
      </text>
      <text x="400" y="270" fontSize="14" fill="#666" textAnchor="middle">
        Community Area
      </text>
    </svg>
  );
};

export default NeighborhoodMap;
