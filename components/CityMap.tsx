import React from "react";

const CityMap: React.FC = () => {
	return (
		<svg
			className="illustration"
			viewBox="0 0 400 400"
			xmlns="http://www.w3.org/2000/svg"
			style={{ borderRadius: "24px", overflow: "hidden" }}
		>
			<defs>
				<filter
					id="mapGlow"
					x="-50%"
					y="-50%"
					width="200%"
					height="200%"
				>
					<feGaussianBlur in="SourceGraphic" stdDeviation={2} />
				</filter>
				<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop
						offset="0%"
						style={{ stopColor: "#171717", stopOpacity: 0.3 }}
					/>
					<stop
						offset="50%"
						style={{ stopColor: "#171717", stopOpacity: 0.3 }}
					/>
					<stop
						offset="100%"
						style={{ stopColor: "#171717", stopOpacity: 0.3 }}
					/>
				</linearGradient>
			</defs>

			{/* Background with rounded corners and border */}
			<rect
				width="400"
				height="400"
				rx={24}
				ry={24}
				fill="url(#bgGrad)"
				stroke="#808080" // border color
				strokeWidth={4} // <-- thickness (change this number)
				opacity={0.1}
			/>

			{/* Grid lines */}
			<g
				stroke="#262626"
				strokeWidth={3}
				opacity={0.55}
				strokeLinecap="round"
			>
				{[...Array(9)].map((_, i) => (
					<line
						key={`v-${i}`}
						x1={i * 50}
						y1={0}
						x2={i * 50}
						y2={400}
					/>
				))}
				{[...Array(9)].map((_, i) => (
					<line
						key={`h-${i}`}
						x1={0}
						y1={i * 50}
						x2={400}
						y2={i * 50}
					/>
				))}
			</g>

			{/* Buildings */}
			<g opacity={0.1} fill="#262626">
				{Array.from({ length: 8 }).map((_, row) =>
					[7, 52, 108, 160, 210, 258, 308, 355].map((x, col) => (
						<rect
							key={`b-${row}-${col}`}
							x={x}
							y={8 + row * 50}
							width={36}
							height={36}
							rx={8}
							ry={8}
						/>
					)),
				)}
			</g>

			{/* Animated dashed lines - draw from center to spawning points */}
			<g
				stroke="#404040"
				strokeWidth={3}
				strokeDasharray="9,9"
				strokeLinecap="round"
				opacity={0.5}
			>
				{[
					{ x2: 245, y2: 50, delay: 1.5 },
					{ x2: 355, y2: 140, delay: 2.7 },
					{ x2: 320, y2: 280, delay: 3.9 },
					{ x2: 75, y2: 325, delay: 5.1 },
					{ x2: 40, y2: 145, delay: 6.3 },
					{ x2: 155, y2: 65, delay: 7.5 },
				].map((line, idx) => (
					<line
						key={`dash-${idx}`}
						x1={200}
						y1={200}
						x2={line.x2}
						y2={line.y2}
						opacity={0}
					>
						<animate
							attributeName="opacity"
							values="0;0.5;0.5;0"
							keyTimes="0;0.15;0.65;1"
							dur="9.6s"
							begin={`${line.delay}s`}
							repeatCount="indefinite"
						/>
						<animate
							attributeName="stroke-dashoffset"
							from="36"
							to="0"
							dur="1.44s"
							begin={`${line.delay}s`}
							repeatCount="indefinite"
						/>
					</line>
				))}
			</g>

			{/* Animated transitioning points - fade in red, turn green, fade out */}
			<g filter="url(#mapGlow)">
				{[
					{ cx: 245, cy: 50, delay: 0 },
					{ cx: 355, cy: 140, delay: 1.2 },
					{ cx: 320, cy: 280, delay: 2.4 },
					{ cx: 75, cy: 325, delay: 3.6 },
					{ cx: 40, cy: 145, delay: 4.8 },
					{ cx: 155, cy: 65, delay: 6 },
				].map((point, idx) => (
					<React.Fragment key={`transition-${idx}`}>
						<circle cx={point.cx} cy={point.cy} r={6} opacity={0}>
							<animate
								attributeName="fill"
								values="#fd4d4d;#fd4d4d;#4CAF50;#4CAF50"
								keyTimes="0;0.15;0.4;1"
								dur="9.6s"
								begin={`${point.delay}s`}
								repeatCount="indefinite"
							/>
							<animate
								attributeName="opacity"
								values="0;1;1;0"
								keyTimes="0;0.15;0.4;1"
								dur="9.6s"
								begin={`${point.delay}s`}
								repeatCount="indefinite"
							/>
						</circle>
					</React.Fragment>
				))}
			</g>

			{/* Pulsing points */}
			<g filter="url(#mapGlow)">
				{[
					{ cx: 200, cy: 200, color: "#4CAF50" }, // green center only
				].map((point, idx) => {
					return (
						<React.Fragment key={idx}>
							<circle
								cx={point.cx}
								cy={point.cy}
								r={6}
								fill={point.color}
							/>
							<circle
								cx={point.cx}
								cy={point.cy}
								r={10}
								fill="none"
								stroke={point.color}
								strokeWidth={1}
								opacity={0.3}
							>
								<animate
									attributeName="r"
									from="10"
									to="20"
									dur={`${1.5 + idx * 0.3}s`}
									repeatCount="indefinite"
								/>
								<animate
									attributeName="opacity"
									from="0.5"
									to="0"
									dur={`${1.5 + idx * 0.3}s`}
									repeatCount="indefinite"
								/>
							</circle>
						</React.Fragment>
					);
				})}
			</g>
		</svg>
	);
};

export default CityMap;
