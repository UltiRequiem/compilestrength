export function InfoSection() {
	return (
		<div className="mt-8 space-y-4 text-sm text-zinc-400">
			<div>
				<h3 className="text-lg font-bold mb-2 text-blue-500">
					Standard Plate Colors
				</h3>
				<div className="grid md:grid-cols-2 gap-4">
					<div>
						<h4 className="font-semibold text-zinc-300 mb-2">Kilograms:</h4>
						<ul className="space-y-1">
							<li>
								<span className="inline-block w-4 h-4 bg-red-600 rounded mr-2" />
								25kg - Red
							</li>
							<li>
								<span className="inline-block w-4 h-4 bg-blue-600 rounded mr-2" />
								20kg - Blue
							</li>
							<li>
								<span className="inline-block w-4 h-4 bg-yellow-600 rounded mr-2" />
								15kg - Yellow
							</li>
							<li>
								<span className="inline-block w-4 h-4 bg-green-600 rounded mr-2" />
								10kg - Green
							</li>
						</ul>
					</div>
					<div>
						<h4 className="font-semibold text-zinc-300 mb-2">Pounds:</h4>
						<ul className="space-y-1">
							<li>
								<span className="inline-block w-4 h-4 bg-red-600 rounded mr-2" />
								45lb - Red
							</li>
							<li>
								<span className="inline-block w-4 h-4 bg-blue-600 rounded mr-2" />
								35lb - Blue
							</li>
							<li>
								<span className="inline-block w-4 h-4 bg-yellow-600 rounded mr-2" />
								25lb - Yellow
							</li>
							<li>
								<span className="inline-block w-4 h-4 bg-green-600 rounded mr-2" />
								10lb - Green
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div>
				<h3 className="text-lg font-bold mb-2 text-blue-500">Loading Tips</h3>
				<p>
					Always load plates symmetrically and use collars to secure them. Load
					heavier plates closer to the bar for better balance and safety. The
					calculator assumes standard gym plate availability.
				</p>
			</div>
		</div>
	);
}
