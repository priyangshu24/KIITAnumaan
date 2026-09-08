// ---------------------------------------------------------------------------
// SQL Practice Playground — schema, seed data and graded exercises.
//
// Everything runs against real SQLite (sql.js / WASM) in the browser, so the
// full SQL surface is available: JOINs, CTEs, window functions, subqueries.
//
// Grading works by executing the reference solution and comparing result sets,
// so any correct query passes regardless of how it is written.
// ---------------------------------------------------------------------------

export type SqlDifficulty = 'Easy' | 'Medium' | 'Hard'

export interface SqlExercise {
  id: string
  title: string
  difficulty: SqlDifficulty
  concepts: string[]
  prompt: string
  /** Reference solution — used to compute the expected result set. */
  solution: string
  starter: string
  hint: string
  /** true when row order is part of the answer (the prompt says ORDER BY). */
  ordered: boolean
}

export interface SqlTable {
  name: string
  columns: { name: string; type: string; note?: string }[]
}

// ---- schema ---------------------------------------------------------------

export const SQL_SCHEMA_DDL = `
CREATE TABLE customers (
  id           INTEGER PRIMARY KEY,
  name         TEXT    NOT NULL,
  city         TEXT    NOT NULL,
  signup_date  TEXT    NOT NULL
);

CREATE TABLE products (
  id        INTEGER PRIMARY KEY,
  name      TEXT    NOT NULL,
  category  TEXT    NOT NULL,
  price     REAL    NOT NULL
);

CREATE TABLE orders (
  id           INTEGER PRIMARY KEY,
  customer_id  INTEGER NOT NULL REFERENCES customers(id),
  order_date   TEXT    NOT NULL,
  status       TEXT    NOT NULL
);

CREATE TABLE order_items (
  id          INTEGER PRIMARY KEY,
  order_id    INTEGER NOT NULL REFERENCES orders(id),
  product_id  INTEGER NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL,
  unit_price  REAL    NOT NULL
);

CREATE TABLE employees (
  id          INTEGER PRIMARY KEY,
  name        TEXT    NOT NULL,
  dept        TEXT    NOT NULL,
  salary      INTEGER NOT NULL,
  manager_id  INTEGER REFERENCES employees(id)
);
`

export const SQL_SEED_DML = `
INSERT INTO customers (id, name, city, signup_date) VALUES
 (1,'Aarav Sharma','Bengaluru','2025-01-12'),
 (2,'Diya Patel','Mumbai','2025-02-03'),
 (3,'Rohan Das','Bengaluru','2025-02-19'),
 (4,'Ishita Roy','Kolkata','2025-03-05'),
 (5,'Kabir Nair','Bengaluru','2025-03-22'),
 (6,'Ananya Iyer','Chennai','2025-04-10'),
 (7,'Vivaan Gupta','Delhi','2025-04-28'),
 (8,'Meera Joshi','Mumbai','2025-05-14'),
 (9,'Arjun Reddy','Hyderabad','2025-06-01'),
 (10,'Saanvi Bose','Kolkata','2025-06-17');

INSERT INTO products (id, name, category, price) VALUES
 (1,'Mechanical Keyboard','Peripherals',6500),
 (2,'Wireless Mouse','Peripherals',1800),
 (3,'27in 4K Monitor','Displays',32000),
 (4,'USB-C Hub','Peripherals',2400),
 (5,'Noise Cancelling Headphones','Audio',18500),
 (6,'Laptop Stand','Accessories',2200),
 (7,'Webcam 1080p','Peripherals',4200),
 (8,'Studio Microphone','Audio',9800),
 (9,'34in Ultrawide Monitor','Displays',48000),
 (10,'Desk Mat','Accessories',900);

INSERT INTO orders (id, customer_id, order_date, status) VALUES
 (1,1,'2025-06-02','delivered'),
 (2,1,'2025-06-21','delivered'),
 (3,2,'2025-06-05','delivered'),
 (4,3,'2025-07-11','delivered'),
 (5,3,'2025-07-19','cancelled'),
 (6,4,'2025-07-25','delivered'),
 (7,5,'2025-08-02','delivered'),
 (8,5,'2025-08-14','delivered'),
 (9,6,'2025-08-20','delivered'),
 (10,7,'2025-08-27','delivered'),
 (11,8,'2025-09-03','delivered'),
 (12,1,'2025-09-09','delivered'),
 (13,9,'2025-09-15','delivered'),
 (14,2,'2025-09-21','delivered'),
 (15,5,'2025-09-28','delivered');

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES
 (1,1,1,1,6500),(2,1,2,2,1800),
 (3,2,3,1,32000),
 (4,3,5,1,18500),(5,3,6,1,2200),
 (6,4,1,2,6500),(7,4,10,3,900),
 (8,5,9,1,48000),
 (9,6,7,1,4200),(10,6,4,2,2400),
 (11,7,9,1,48000),(12,7,8,1,9800),
 (13,8,2,1,1800),
 (14,9,3,2,32000),
 (15,10,5,1,18500),(16,10,1,1,6500),
 (17,11,8,2,9800),
 (18,12,4,1,2400),(19,12,6,2,2200),
 (20,13,3,1,32000),(21,13,2,3,1800),
 (22,14,10,5,900),
 (23,15,9,1,48000),(24,15,7,2,4200);

INSERT INTO employees (id, name, dept, salary, manager_id) VALUES
 (1,'Nandini Rao','Engineering',320000,NULL),
 (2,'Karthik Menon','Engineering',185000,1),
 (3,'Priya Verma','Engineering',210000,1),
 (4,'Aditya Kulkarni','Engineering',145000,3),
 (5,'Sneha Mishra','Design',160000,1),
 (6,'Rahul Chatterjee','Design',120000,5),
 (7,'Tanvi Shah','Sales',175000,1),
 (8,'Manish Pillai','Sales',195000,7),
 (9,'Lakshmi Nambiar','Sales',110000,7),
 (10,'Farhan Ali','Engineering',230000,1);
`

export const SQL_TABLES: SqlTable[] = [
  {
    name: 'customers',
    columns: [
      { name: 'id', type: 'INTEGER', note: 'PK' },
      { name: 'name', type: 'TEXT' },
      { name: 'city', type: 'TEXT' },
      { name: 'signup_date', type: 'TEXT' },
    ],
  },
  {
    name: 'products',
    columns: [
      { name: 'id', type: 'INTEGER', note: 'PK' },
      { name: 'name', type: 'TEXT' },
      { name: 'category', type: 'TEXT' },
      { name: 'price', type: 'REAL' },
    ],
  },
  {
    name: 'orders',
    columns: [
      { name: 'id', type: 'INTEGER', note: 'PK' },
      { name: 'customer_id', type: 'INTEGER', note: '→ customers.id' },
      { name: 'order_date', type: 'TEXT' },
      { name: 'status', type: 'TEXT', note: "delivered | cancelled" },
    ],
  },
  {
    name: 'order_items',
    columns: [
      { name: 'id', type: 'INTEGER', note: 'PK' },
      { name: 'order_id', type: 'INTEGER', note: '→ orders.id' },
      { name: 'product_id', type: 'INTEGER', note: '→ products.id' },
      { name: 'quantity', type: 'INTEGER' },
      { name: 'unit_price', type: 'REAL' },
    ],
  },
  {
    name: 'employees',
    columns: [
      { name: 'id', type: 'INTEGER', note: 'PK' },
      { name: 'name', type: 'TEXT' },
      { name: 'dept', type: 'TEXT' },
      { name: 'salary', type: 'INTEGER' },
      { name: 'manager_id', type: 'INTEGER', note: '→ employees.id (self)' },
    ],
  },
]

// ---- exercises ------------------------------------------------------------

export const SQL_EXERCISES: SqlExercise[] = [
  {
    id: 'sql-1',
    title: 'Customers in a City',
    difficulty: 'Easy',
    concepts: ['SELECT', 'WHERE', 'ORDER BY'],
    prompt:
      'Return the `name` and `signup_date` of every customer based in **Bengaluru**, sorted by `name` ascending.',
    solution: `SELECT name, signup_date
FROM customers
WHERE city = 'Bengaluru'
ORDER BY name;`,
    starter: `-- Customers based in Bengaluru, sorted by name
SELECT
FROM customers
`,
    hint: 'String comparison is case-sensitive in SQLite by default. Filter with WHERE, then ORDER BY name.',
    ordered: true,
  },
  {
    id: 'sql-2',
    title: 'Premium Products',
    difficulty: 'Easy',
    concepts: ['WHERE', 'ORDER BY', 'Comparison'],
    prompt:
      'Return `name`, `category` and `price` for every product priced above **5000**, most expensive first.',
    solution: `SELECT name, category, price
FROM products
WHERE price > 5000
ORDER BY price DESC;`,
    starter: `-- Products above 5000, most expensive first
SELECT name, category, price
FROM products
`,
    hint: 'A single WHERE predicate plus ORDER BY ... DESC.',
    ordered: true,
  },
  {
    id: 'sql-3',
    title: 'Orders per Customer',
    difficulty: 'Easy',
    concepts: ['JOIN', 'GROUP BY', 'COUNT'],
    prompt:
      'For every customer who has placed at least one order, return `name` and `order_count`. Sort by `order_count` descending, then `name` ascending.',
    solution: `SELECT c.name AS name, COUNT(o.id) AS order_count
FROM customers c
JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY order_count DESC, name ASC;`,
    starter: `-- Order count per customer
SELECT c.name AS name, COUNT(o.id) AS order_count
FROM customers c
`,
    hint: 'An INNER JOIN already excludes customers with no orders. Group by the customer, then COUNT.',
    ordered: true,
  },
  {
    id: 'sql-4',
    title: 'Customers With No Orders',
    difficulty: 'Medium',
    concepts: ['LEFT JOIN', 'IS NULL', 'Anti-join'],
    prompt:
      'Return the `name` of every customer who has **never** placed an order, sorted by `name`.',
    solution: `SELECT c.name AS name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL
ORDER BY c.name;`,
    starter: `-- Customers who have never ordered
SELECT c.name AS name
FROM customers c
`,
    hint: 'LEFT JOIN then filter WHERE the right-hand key IS NULL. NOT EXISTS also works — and is safer than NOT IN.',
    ordered: true,
  },
  {
    id: 'sql-5',
    title: 'Revenue per Customer',
    difficulty: 'Medium',
    concepts: ['Multi-table JOIN', 'SUM', 'HAVING'],
    prompt:
      'Compute total revenue per customer from **delivered** orders only. Revenue for a line item is `quantity * unit_price`. Return `name` and `revenue` for customers whose revenue exceeds **20000**, highest first.',
    solution: `SELECT c.name AS name, SUM(oi.quantity * oi.unit_price) AS revenue
FROM customers c
JOIN orders o      ON o.customer_id = c.id AND o.status = 'delivered'
JOIN order_items oi ON oi.order_id = o.id
GROUP BY c.id, c.name
HAVING SUM(oi.quantity * oi.unit_price) > 20000
ORDER BY revenue DESC;`,
    starter: `-- Revenue per customer (delivered orders only), > 20000
SELECT c.name AS name, SUM(oi.quantity * oi.unit_price) AS revenue
FROM customers c
`,
    hint: 'Filter status in WHERE or in the JOIN condition, then aggregate. Row filters go in WHERE, group filters in HAVING.',
    ordered: true,
  },
  {
    id: 'sql-6',
    title: 'Second Highest Salary',
    difficulty: 'Medium',
    concepts: ['Subquery', 'MAX', 'DENSE_RANK'],
    prompt:
      'Return the second highest **distinct** salary in `employees` as a single column named `second_highest`.',
    solution: `SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);`,
    starter: `-- Second highest distinct salary
SELECT
FROM employees
`,
    hint: 'MAX of everything strictly below the overall MAX. A DENSE_RANK() = 2 window query is equally valid.',
    ordered: false,
  },
  {
    id: 'sql-7',
    title: 'Earning More Than Their Manager',
    difficulty: 'Medium',
    concepts: ['Self-join', 'Aliasing'],
    prompt:
      'Return the `employee` name and their `manager` name for every employee who earns strictly more than their manager. Sort by `employee`.',
    solution: `SELECT e.name AS employee, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary
ORDER BY employee;`,
    starter: `-- Employees out-earning their manager
SELECT e.name AS employee, m.name AS manager
FROM employees e
`,
    hint: 'Join the table to itself with two aliases: e for the employee, m for the manager.',
    ordered: true,
  },
  {
    id: 'sql-8',
    title: 'Top Product per Category',
    difficulty: 'Hard',
    concepts: ['Window functions', 'ROW_NUMBER', 'CTE'],
    prompt:
      'For each product `category`, return the single product with the highest total revenue (`quantity * unit_price` summed across all order items). Return `category`, `name` and `revenue`, sorted by `revenue` descending.',
    solution: `WITH product_revenue AS (
  SELECT p.category AS category,
         p.name     AS name,
         SUM(oi.quantity * oi.unit_price) AS revenue
  FROM products p
  JOIN order_items oi ON oi.product_id = p.id
  GROUP BY p.id, p.category, p.name
),
ranked AS (
  SELECT category, name, revenue,
         ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) AS rn
  FROM product_revenue
)
SELECT category, name, revenue
FROM ranked
WHERE rn = 1
ORDER BY revenue DESC;`,
    starter: `-- Highest-revenue product in each category
WITH product_revenue AS (
  SELECT p.category AS category, p.name AS name,
         SUM(oi.quantity * oi.unit_price) AS revenue
  FROM products p
  JOIN order_items oi ON oi.product_id = p.id
  GROUP BY p.id, p.category, p.name
)
SELECT
`,
    hint: 'Aggregate revenue per product first, then ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) and keep rn = 1.',
    ordered: true,
  },
  {
    id: 'sql-9',
    title: 'Running Revenue Total',
    difficulty: 'Hard',
    concepts: ['Window frame', 'SUM OVER', 'ORDER BY'],
    prompt:
      'For each **delivered** order, return `order_date`, that order\'s `order_revenue`, and a `running_total` of revenue across all delivered orders ordered by `order_date` then `id`. Sort by `order_date`, then `id`.',
    solution: `WITH per_order AS (
  SELECT o.id AS id,
         o.order_date AS order_date,
         SUM(oi.quantity * oi.unit_price) AS order_revenue
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  WHERE o.status = 'delivered'
  GROUP BY o.id, o.order_date
)
SELECT order_date,
       order_revenue,
       SUM(order_revenue) OVER (ORDER BY order_date, id
                                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM per_order
ORDER BY order_date, id;`,
    starter: `-- Running revenue total over delivered orders
WITH per_order AS (
  SELECT o.id AS id, o.order_date AS order_date,
         SUM(oi.quantity * oi.unit_price) AS order_revenue
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  WHERE o.status = 'delivered'
  GROUP BY o.id, o.order_date
)
SELECT
`,
    hint: 'SUM(x) OVER (ORDER BY ... ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) is the running-total frame.',
    ordered: true,
  },
  {
    id: 'sql-10',
    title: 'Monthly Revenue Growth',
    difficulty: 'Hard',
    concepts: ['CTE', 'LAG', 'Date grouping'],
    prompt:
      'Return monthly delivered revenue as `month` (format `YYYY-MM`), `revenue`, and `prev_revenue` (the previous month\'s revenue, NULL for the first month). Sort by `month`.',
    solution: `WITH monthly AS (
  SELECT substr(o.order_date, 1, 7) AS month,
         SUM(oi.quantity * oi.unit_price) AS revenue
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  WHERE o.status = 'delivered'
  GROUP BY substr(o.order_date, 1, 7)
)
SELECT month,
       revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_revenue
FROM monthly
ORDER BY month;`,
    starter: `-- Monthly revenue with the previous month alongside
WITH monthly AS (
  SELECT substr(o.order_date, 1, 7) AS month,
         SUM(oi.quantity * oi.unit_price) AS revenue
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  WHERE o.status = 'delivered'
  GROUP BY substr(o.order_date, 1, 7)
)
SELECT
`,
    hint: 'substr(date, 1, 7) gives YYYY-MM in SQLite. LAG(revenue) OVER (ORDER BY month) fetches the previous row.',
    ordered: true,
  },
]

/** Exercises grouped by concept — drives the question rail and the browse list. */
export const SQL_TOPICS: { name: string; ids: string[] }[] = [
  { name: 'Filtering & Sorting', ids: ['sql-1', 'sql-2'] },
  { name: 'Joins & Aggregation', ids: ['sql-3', 'sql-4', 'sql-5', 'sql-7'] },
  { name: 'Subqueries', ids: ['sql-6'] },
  { name: 'Window Functions & CTEs', ids: ['sql-8', 'sql-9', 'sql-10'] },
]

/** Topic name for an exercise id. */
export const topicOf = (id: string): string =>
  SQL_TOPICS.find((t) => t.ids.includes(id))?.name ?? 'Other'

export const SQL_DIFFICULTY_COLOR: Record<SqlDifficulty, { text: string; bg: string; border: string }> = {
  Easy: { text: '#10B981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.30)' },
  Medium: { text: '#F59E0B', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.30)' },
  Hard: { text: '#EF4444', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.30)' },
}
