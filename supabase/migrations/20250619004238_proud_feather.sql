/*
  # Add Solution Data for URL Shortener Challenge

  1. Updates
    - Add solution approaches for the URL shortener system design challenge
    - Ensure the challenge has proper solution data

  2. Security
    - No changes to RLS policies needed
*/

-- Update the URL shortener challenge with comprehensive solution approaches
UPDATE challenges 
SET solution_approaches = '[
  {
    "id": "simple_monolith",
    "title": "Simple Monolithic Service",
    "description": "A single service handling all URL shortening functionality with a relational database.",
    "complexity": "low",
    "scalability": "medium",
    "cost": "low",
    "canvasData": {
      "elements": [
        {"id": "1", "type": "rectangle", "x": 100, "y": 80, "width": 150, "height": 60, "color": "#3B82F6", "strokeWidth": 2},
        {"id": "2", "type": "text", "x": 175, "y": 115, "text": "URL Shortener API", "color": "#1F2937", "strokeWidth": 1},
        {"id": "3", "type": "rectangle", "x": 100, "y": 200, "width": 150, "height": 60, "color": "#10B981", "strokeWidth": 2},
        {"id": "4", "type": "text", "x": 155, "y": 235, "text": "PostgreSQL DB", "color": "#1F2937", "strokeWidth": 1},
        {"id": "5", "type": "arrow", "startX": 175, "startY": 140, "endX": 175, "endY": 200, "color": "#6B7280", "strokeWidth": 2},
        {"id": "6", "type": "rectangle", "x": 350, "y": 80, "width": 120, "height": 60, "color": "#F59E0B", "strokeWidth": 2},
        {"id": "7", "type": "text", "x": 395, "y": 115, "text": "Redis Cache", "color": "#1F2937", "strokeWidth": 1},
        {"id": "8", "type": "arrow", "startX": 250, "startY": 110, "endX": 350, "endY": 110, "color": "#6B7280", "strokeWidth": 2}
      ],
      "canvasWidth": 600,
      "canvasHeight": 400
    },
    "pros": [
      "Simple to develop and deploy",
      "Easy to debug and monitor",
      "Low operational complexity",
      "Cost-effective for small to medium scale"
    ],
    "cons": [
      "Single point of failure",
      "Limited horizontal scaling",
      "Performance bottleneck at high traffic",
      "Technology stack lock-in"
    ],
    "bestFor": [
      "MVP and early-stage products",
      "Small to medium traffic volumes",
      "Teams with limited DevOps experience",
      "Budget-constrained projects"
    ],
    "considerations": [
      "Implement proper caching strategy",
      "Use connection pooling for database",
      "Add monitoring and alerting",
      "Plan for vertical scaling limits"
    ]
  },
  {
    "id": "microservices_distributed",
    "title": "Microservices with Distributed Cache",
    "description": "Separate services for URL shortening, analytics, and user management with distributed caching.",
    "complexity": "high",
    "scalability": "high",
    "cost": "high",
    "canvasData": {
      "elements": [
        {"id": "1", "type": "rectangle", "x": 50, "y": 50, "width": 100, "height": 50, "color": "#3B82F6", "strokeWidth": 2},
        {"id": "2", "type": "text", "x": 85, "y": 80, "text": "API Gateway", "color": "#1F2937", "strokeWidth": 1},
        {"id": "3", "type": "rectangle", "x": 200, "y": 50, "width": 100, "height": 50, "color": "#10B981", "strokeWidth": 2},
        {"id": "4", "type": "text", "x": 230, "y": 80, "text": "URL Service", "color": "#1F2937", "strokeWidth": 1},
        {"id": "5", "type": "rectangle", "x": 350, "y": 50, "width": 100, "height": 50, "color": "#F59E0B", "strokeWidth": 2},
        {"id": "6", "type": "text", "x": 375, "y": 80, "text": "Analytics Service", "color": "#1F2937", "strokeWidth": 1},
        {"id": "7", "type": "rectangle", "x": 500, "y": 50, "width": 100, "height": 50, "color": "#8B5CF6", "strokeWidth": 2},
        {"id": "8", "type": "text", "x": 530, "y": 80, "text": "User Service", "color": "#1F2937", "strokeWidth": 1},
        {"id": "9", "type": "rectangle", "x": 200, "y": 150, "width": 100, "height": 50, "color": "#EF4444", "strokeWidth": 2},
        {"id": "10", "type": "text", "x": 235, "y": 180, "text": "Redis Cluster", "color": "#1F2937", "strokeWidth": 1},
        {"id": "11", "type": "rectangle", "x": 350, "y": 150, "width": 100, "height": 50, "color": "#6B7280", "strokeWidth": 2},
        {"id": "12", "type": "text", "x": 385, "y": 180, "text": "Database", "color": "#1F2937", "strokeWidth": 1},
        {"id": "13", "type": "arrow", "startX": 150, "startY": 75, "endX": 200, "endY": 75, "color": "#6B7280", "strokeWidth": 2},
        {"id": "14", "type": "arrow", "startX": 250, "startY": 100, "endX": 250, "endY": 150, "color": "#6B7280", "strokeWidth": 2},
        {"id": "15", "type": "arrow", "startX": 400, "startY": 100, "endX": 400, "endY": 150, "color": "#6B7280", "strokeWidth": 2}
      ],
      "canvasWidth": 700,
      "canvasHeight": 300
    },
    "pros": [
      "High scalability and availability",
      "Independent service deployment",
      "Technology diversity allowed",
      "Better fault isolation"
    ],
    "cons": [
      "Increased operational complexity",
      "Network latency between services",
      "Distributed system challenges",
      "Higher infrastructure costs"
    ],
    "bestFor": [
      "High-traffic applications",
      "Large engineering teams",
      "Complex business requirements",
      "Global scale deployments"
    ],
    "considerations": [
      "Implement service discovery",
      "Use circuit breakers for resilience",
      "Plan for eventual consistency",
      "Implement distributed tracing"
    ]
  },
  {
    "id": "serverless_event_driven",
    "title": "Serverless Event-Driven Architecture",
    "description": "Cloud functions for URL processing with event-driven analytics and managed databases.",
    "complexity": "medium",
    "scalability": "high",
    "cost": "low",
    "canvasData": {
      "elements": [
        {"id": "1", "type": "rectangle", "x": 50, "y": 80, "width": 120, "height": 50, "color": "#F59E0B", "strokeWidth": 2},
        {"id": "2", "type": "text", "x": 95, "y": 110, "text": "API Gateway", "color": "#1F2937", "strokeWidth": 1},
        {"id": "3", "type": "rectangle", "x": 220, "y": 80, "width": 120, "height": 50, "color": "#10B981", "strokeWidth": 2},
        {"id": "4", "type": "text", "x": 255, "y": 110, "text": "Lambda Functions", "color": "#1F2937", "strokeWidth": 1},
        {"id": "5", "type": "rectangle", "x": 390, "y": 80, "width": 120, "height": 50, "color": "#8B5CF6", "strokeWidth": 2},
        {"id": "6", "type": "text", "x": 430, "y": 110, "text": "DynamoDB", "color": "#1F2937", "strokeWidth": 1},
        {"id": "7", "type": "rectangle", "x": 220, "y": 180, "width": 120, "height": 50, "color": "#EF4444", "strokeWidth": 2},
        {"id": "8", "type": "text", "x": 260, "y": 210, "text": "Event Queue", "color": "#1F2937", "strokeWidth": 1},
        {"id": "9", "type": "rectangle", "x": 390, "y": 180, "width": 120, "height": 50, "color": "#3B82F6", "strokeWidth": 2},
        {"id": "10", "type": "text", "x": 425, "y": 210, "text": "Analytics DB", "color": "#1F2937", "strokeWidth": 1},
        {"id": "11", "type": "arrow", "startX": 170, "startY": 105, "endX": 220, "endY": 105, "color": "#6B7280", "strokeWidth": 2},
        {"id": "12", "type": "arrow", "startX": 340, "startY": 105, "endX": 390, "endY": 105, "color": "#6B7280", "strokeWidth": 2},
        {"id": "13", "type": "arrow", "startX": 280, "startY": 130, "endX": 280, "endY": 180, "color": "#6B7280", "strokeWidth": 2},
        {"id": "14", "type": "arrow", "startX": 340, "startY": 205, "endX": 390, "endY": 205, "color": "#6B7280", "strokeWidth": 2}
      ],
      "canvasWidth": 600,
      "canvasHeight": 300
    },
    "pros": [
      "Automatic scaling to zero",
      "Pay-per-request pricing",
      "No server management",
      "Built-in high availability"
    ],
    "cons": [
      "Cold start latency",
      "Vendor lock-in",
      "Limited execution time",
      "Complex debugging"
    ],
    "bestFor": [
      "Variable traffic patterns",
      "Cost-sensitive applications",
      "Rapid development cycles",
      "Event-driven workflows"
    ],
    "considerations": [
      "Optimize for cold starts",
      "Use provisioned concurrency for critical paths",
      "Implement proper error handling",
      "Monitor function performance"
    ]
  },
  {
    "id": "cdn_edge_computing",
    "title": "CDN with Edge Computing",
    "description": "Global CDN with edge computing for ultra-low latency URL resolution and geographic distribution.",
    "complexity": "high",
    "scalability": "high",
    "cost": "medium",
    "canvasData": {
      "elements": [
        {"id": "1", "type": "circle", "x": 150, "y": 100, "radius": 40, "color": "#3B82F6", "strokeWidth": 2},
        {"id": "2", "type": "text", "x": 135, "y": 105, "text": "Edge Node", "color": "#1F2937", "strokeWidth": 1},
        {"id": "3", "type": "circle", "x": 350, "y": 100, "radius": 40, "color": "#3B82F6", "strokeWidth": 2},
        {"id": "4", "type": "text", "x": 335, "y": 105, "text": "Edge Node", "color": "#1F2937", "strokeWidth": 1},
        {"id": "5", "type": "circle", "x": 550, "y": 100, "radius": 40, "color": "#3B82F6", "strokeWidth": 2},
        {"id": "6", "type": "text", "x": 535, "y": 105, "text": "Edge Node", "color": "#1F2937", "strokeWidth": 1},
        {"id": "7", "type": "rectangle", "x": 300, "y": 200, "width": 100, "height": 50, "color": "#10B981", "strokeWidth": 2},
        {"id": "8", "type": "text", "x": 330, "y": 230, "text": "Origin Server", "color": "#1F2937", "strokeWidth": 1},
        {"id": "9", "type": "rectangle", "x": 300, "y": 300, "width": 100, "height": 50, "color": "#8B5CF6", "strokeWidth": 2},
        {"id": "10", "type": "text", "x": 335, "y": 330, "text": "Database", "color": "#1F2937", "strokeWidth": 1},
        {"id": "11", "type": "arrow", "startX": 150, "startY": 140, "endX": 330, "endY": 200, "color": "#6B7280", "strokeWidth": 2},
        {"id": "12", "type": "arrow", "startX": 350, "startY": 140, "endX": 350, "endY": 200, "color": "#6B7280", "strokeWidth": 2},
        {"id": "13", "type": "arrow", "startX": 550, "startY": 140, "endX": 370, "endY": 200, "color": "#6B7280", "strokeWidth": 2},
        {"id": "14", "type": "arrow", "startX": 350, "startY": 250, "endX": 350, "endY": 300, "color": "#6B7280", "strokeWidth": 2}
      ],
      "canvasWidth": 700,
      "canvasHeight": 400
    },
    "pros": [
      "Ultra-low latency globally",
      "High availability and redundancy",
      "Reduced origin server load",
      "Better user experience"
    ],
    "cons": [
      "Complex cache invalidation",
      "Higher infrastructure costs",
      "Eventual consistency challenges",
      "Complex deployment pipeline"
    ],
    "bestFor": [
      "Global applications",
      "Performance-critical systems",
      "High-traffic consumer apps",
      "Real-time applications"
    ],
    "considerations": [
      "Implement smart cache strategies",
      "Plan for cache invalidation",
      "Monitor edge performance",
      "Handle geographic data compliance"
    ]
  }
]'::jsonb,
community_discussion_enabled = true,
solution_access_level = 'submission_required'
WHERE title ILIKE '%url%shortener%' OR title ILIKE '%url%shortening%' OR description ILIKE '%url%shortener%';

-- If no URL shortener challenge exists, let's check what system design challenges we have
-- and update them with solution data
UPDATE challenges 
SET solution_approaches = '[
  {
    "id": "microservices",
    "title": "Microservices Architecture",
    "description": "A distributed architecture with independent services for each business domain.",
    "complexity": "high",
    "scalability": "high", 
    "cost": "high",
    "canvasData": {
      "elements": [
        {"id": "1", "type": "rectangle", "x": 50, "y": 100, "width": 120, "height": 60, "color": "#3B82F6", "strokeWidth": 2},
        {"id": "2", "type": "rectangle", "x": 200, "y": 100, "width": 120, "height": 60, "color": "#10B981", "strokeWidth": 2},
        {"id": "3", "type": "rectangle", "x": 350, "y": 100, "width": 120, "height": 60, "color": "#F59E0B", "strokeWidth": 2},
        {"id": "4", "type": "text", "x": 110, "y": 135, "text": "User Service", "color": "#1F2937", "strokeWidth": 1},
        {"id": "5", "type": "text", "x": 250, "y": 135, "text": "Order Service", "color": "#1F2937", "strokeWidth": 1},
        {"id": "6", "type": "text", "x": 400, "y": 135, "text": "Payment Service", "color": "#1F2937", "strokeWidth": 1},
        {"id": "7", "type": "rectangle", "x": 200, "y": 250, "width": 120, "height": 60, "color": "#8B5CF6", "strokeWidth": 2},
        {"id": "8", "type": "text", "x": 245, "y": 285, "text": "Database", "color": "#1F2937", "strokeWidth": 1},
        {"id": "9", "type": "arrow", "startX": 110, "startY": 160, "endX": 110, "endY": 200, "color": "#6B7280", "strokeWidth": 2},
        {"id": "10", "type": "arrow", "startX": 260, "startY": 160, "endX": 260, "endY": 250, "color": "#6B7280", "strokeWidth": 2}
      ],
      "canvasWidth": 800,
      "canvasHeight": 400
    },
    "pros": [
      "High scalability and flexibility",
      "Independent deployment and development", 
      "Technology diversity allowed",
      "Fault isolation between services"
    ],
    "cons": [
      "Increased complexity in service coordination",
      "Network latency between services",
      "Distributed system challenges",
      "Higher operational overhead"
    ],
    "bestFor": [
      "Large-scale applications",
      "Teams with microservices expertise",
      "Applications requiring high availability",
      "Complex business domains"
    ],
    "considerations": [
      "Implement proper service discovery",
      "Use API gateways for external communication", 
      "Implement distributed tracing",
      "Plan for eventual consistency"
    ]
  },
  {
    "id": "monolithic",
    "title": "Modular Monolith",
    "description": "A single deployable unit with well-defined internal module boundaries.",
    "complexity": "low",
    "scalability": "medium",
    "cost": "low",
    "canvasData": {
      "elements": [
        {"id": "1", "type": "rectangle", "x": 200, "y": 80, "width": 300, "height": 200, "color": "#3B82F6", "strokeWidth": 3},
        {"id": "2", "type": "rectangle", "x": 220, "y": 100, "width": 80, "height": 50, "color": "#10B981", "strokeWidth": 2},
        {"id": "3", "type": "rectangle", "x": 320, "y": 100, "width": 80, "height": 50, "color": "#F59E0B", "strokeWidth": 2},
        {"id": "4", "type": "rectangle", "x": 420, "y": 100, "width": 80, "height": 50, "color": "#EF4444", "strokeWidth": 2},
        {"id": "5", "type": "rectangle", "x": 270, "y": 180, "width": 160, "height": 50, "color": "#8B5CF6", "strokeWidth": 2},
        {"id": "6", "type": "text", "x": 245, "y": 130, "text": "User Module", "color": "#1F2937", "strokeWidth": 1},
        {"id": "7", "type": "text", "x": 340, "y": 130, "text": "Order Module", "color": "#1F2937", "strokeWidth": 1},
        {"id": "8", "type": "text", "x": 435, "y": 130, "text": "Payment Module", "color": "#1F2937", "strokeWidth": 1},
        {"id": "9", "type": "text", "x": 330, "y": 210, "text": "Shared Database", "color": "#1F2937", "strokeWidth": 1},
        {"id": "10", "type": "text", "x": 320, "y": 60, "text": "Monolithic Application", "color": "#1F2937", "strokeWidth": 1}
      ],
      "canvasWidth": 800,
      "canvasHeight": 400
    },
    "pros": [
      "Simpler deployment and testing",
      "Better performance (no network calls)",
      "Easier debugging and monitoring",
      "Lower operational complexity"
    ],
    "cons": [
      "Limited scalability options",
      "Technology stack lock-in",
      "Potential for tight coupling",
      "Larger deployment units"
    ],
    "bestFor": [
      "Small to medium applications",
      "Teams new to distributed systems",
      "Applications with simple domains",
      "Rapid prototyping and MVP development"
    ],
    "considerations": [
      "Maintain clear module boundaries",
      "Use dependency injection",
      "Implement proper layering",
      "Plan for future decomposition"
    ]
  }
]'::jsonb,
community_discussion_enabled = true,
solution_access_level = 'submission_required'
WHERE challenge_type = 'system_design' AND (solution_approaches IS NULL OR solution_approaches = '[]'::jsonb);