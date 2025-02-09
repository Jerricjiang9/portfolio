import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// Store the selected wedge index
let selectedIndex = -1;
let projects = [];
let projectsContainer = document.querySelector('.projects');
let svg = d3.select("svg");
let colors = d3.scaleOrdinal(d3.schemeTableau10);
let legend = d3.select('.legend');

async function loadProjects() {
    console.log("🔄 Loading projects...");

    try {
        projects = await fetchJSON('../lib/projects.json');
        console.log("✅ Projects fetched:", projects);

        if (!projects || projects.length === 0) {
            console.error("❌ No projects found.");
            return;
        }

        renderProjects(projects, projectsContainer, 'h2');
        updatePieChart(projects); 
    } catch (error) {
        console.error("❌ Error loading projects:", error);
    }
}

// 🟢 Function to update Pie Chart dynamically
function updatePieChart(filteredProjects) {
    // Process Data: Group projects by year
    let rolledData = d3.rollups(
        filteredProjects,
        (v) => v.length,
        (d) => d.year
    );

    let data = rolledData.map(([year, count]) => ({
        value: count,
        label: year
    }));

    console.log("📊 Processed Data:", data);

    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let sliceGenerator = d3.pie().value(d => d.value);
    let arcData = sliceGenerator(data);

    // Clear old chart
    svg.selectAll("path").remove();

    // Draw new chart
    svg.selectAll("path")
        .data(arcData)
        .enter()
        .append("path")
        .attr("d", arcGenerator)
        .attr("fill", (d, i) => colors(i))
        .attr("stroke", "white")
        .attr("stroke-width", "1px")
        .attr("cursor", "pointer")
        .on("click", function (event, d) {
            // Log click event and data
            console.log("🔹 Clicked Wedge Data:", d);
          
            // Ensure selectedIndex is valid
            let index = arcData.findIndex(a => a.startAngle === d.startAngle && a.endAngle === d.endAngle);
            if (index === -1) {
                console.error("❌ No matching index found for selected wedge!");
                return;
            }
        
            selectedIndex = selectedIndex === index ? -1 : index;
            console.log("✔ Selected Index:", selectedIndex);
        
            // Highlight the selected wedge
            svg.selectAll("path")
                .classed("selected", (_, i) => i === selectedIndex);
        
            // Get the selected year (label)
            let selectedYear = data[selectedIndex]?.label;
            if (!selectedYear) {
                console.error("❌ Selected year is undefined.");
                return;
            }
          
            console.log("📅 Selected Year:", selectedYear);
        
            // Filter projects by selected year
            let filteredProjects = selectedIndex !== -1
                ? projects.filter(p => p.year.toString() === selectedYear)
                : projects;
        
            console.log("📁 Filtered Projects:", filteredProjects);
        
            // Update visualization
            renderProjects(filteredProjects, projectsContainer, 'h2');
        });

    // Update legend
    updateLegend(data);
}

function updateLegend(data) {
    legend.html(""); 

    let legendItems = legend.selectAll("li")
        .data(data)
        .enter()
        .append("li")
        .style("color", (d, i) => colors(i))
        .html((d) => `<span class="swatch" style="background-color:${colors(d.label)}"></span> ${d.label} <em>(${d.value})</em>`)
        .attr("cursor", "pointer")
        .on("click", function (_, i) {
            selectedIndex = selectedIndex === i ? -1 : i;
            console.log("🔹 Selected Index:", selectedIndex);
        
            if (selectedIndex !== -1 && selectedIndex < data.length) {
                let selectedYear = data[selectedIndex]?.label;  // Use optional chaining to avoid errors
                let filteredProjects = selectedYear
                    ? projects.filter(p => p.year === selectedYear)
                    : projects;
        
                console.log("📁 Filtered Projects:", filteredProjects);
        
                updateVisualization();
                renderProjects(filteredProjects, projectsContainer, 'h2');
            } else {
                // If no valid selection, reset everything
                renderProjects(projects, projectsContainer, 'h2');
                updatePieChart(projects);
            }
        });
        
}

// 🟢 Function to update Pie Chart & Legend Selection State
function updateVisualization() {
    svg.selectAll("path")
        .attr("class", (_, idx) => idx === selectedIndex ? "selected" : "")
        .attr("fill", (d, idx) => idx === selectedIndex ? "black" : colors(idx));

    legend.selectAll("li")
        .attr("class", (_, idx) => idx === selectedIndex ? "selected" : "");
}

// 🔎 Add Search Filtering
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener("input", (event) => {
    let query = event.target.value.toLowerCase();
    let filteredProjects = projects.filter(p => 
        p.title.toLowerCase().includes(query) || p.year.includes(query)
    );

    renderProjects(filteredProjects, projectsContainer, 'h2');
    updatePieChart(filteredProjects);
});

// Load everything on page load
loadProjects();
