/*
  # Add Code Review Challenges

  This migration adds the actual code review challenges after the enum value has been committed.
  
  1. Challenges Added
    - Basic Code Quality Issues (Easy)
    - Input Validation Vulnerabilities (Medium) 
    - Performance and Memory Issues (Hard)
    - Concurrency and Race Conditions (Hard)
    - Architecture and Design Patterns (Hard)
*/

-- Get the learning path ID and insert challenges
DO $$
DECLARE
    path_id uuid;
BEGIN
    SELECT id INTO path_id FROM learning_paths WHERE title = 'Code Review Mastery';

    -- Beginner Level Challenge
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Basic Code Quality Issues',
        'Review this JavaScript function that calculates user discounts. Identify issues with naming conventions, code duplication, and basic maintainability problems.

**Context**: E-commerce discount calculation system
**Language**: JavaScript
**Time Limit**: 10 minutes

**Your Task**:
1. Identify all code quality issues
2. Suggest specific improvements for each issue
3. Provide refactored code that follows best practices

**Focus Areas**:
- Naming conventions
- Code duplication
- Function complexity
- Magic numbers
- Error handling',
        'easy',
        'code_review',
        'function calculateDiscount(u, t, c) {
    if (u.type == "premium") {
        if (t > 100) {
            return t * 0.2;
        } else if (t > 50) {
            return t * 0.1;
        } else {
            return t * 0.05;
        }
    } else if (u.type == "regular") {
        if (t > 100) {
            return t * 0.1;
        } else if (t > 50) {
            return t * 0.05;
        } else {
            return 0;
        }
    } else if (u.type == "new") {
        if (c && c.isValid) {
            return t * 0.15;
        } else {
            return t * 0.05;
        }
    }
    return 0;
}',
        'function calculateUserDiscount(user, totalAmount, coupon = null) {
    const DISCOUNT_RATES = {
        premium: { high: 0.2, medium: 0.1, low: 0.05 },
        regular: { high: 0.1, medium: 0.05, low: 0 },
        new: { withCoupon: 0.15, default: 0.05 }
    };
    
    const AMOUNT_THRESHOLDS = {
        HIGH: 100,
        MEDIUM: 50
    };

    if (!user || !user.type || totalAmount < 0) {
        throw new Error("Invalid user or amount");
    }

    const userType = user.type.toLowerCase();
    
    if (userType === "new") {
        const hasValidCoupon = coupon && coupon.isValid;
        return totalAmount * (hasValidCoupon ? 
            DISCOUNT_RATES.new.withCoupon : 
            DISCOUNT_RATES.new.default);
    }
    
    if (!DISCOUNT_RATES[userType]) {
        throw new Error("Unknown user type: " + userType);
    }
    
    const rates = DISCOUNT_RATES[userType];
    
    if (totalAmount > AMOUNT_THRESHOLDS.HIGH) {
        return totalAmount * rates.high;
    } else if (totalAmount > AMOUNT_THRESHOLDS.MEDIUM) {
        return totalAmount * rates.medium;
    } else {
        return totalAmount * rates.low;
    }
}',
        '[
            {
                "issue_type": "naming",
                "description": "Poor variable names (u, t, c) make code unreadable",
                "line": 1,
                "severity": "medium",
                "fix": "Use descriptive names: user, totalAmount, coupon"
            },
            {
                "issue_type": "duplication",
                "description": "Repeated discount calculation logic",
                "line": "multiple",
                "severity": "medium",
                "fix": "Extract discount rates to constants and use lookup table"
            },
            {
                "issue_type": "magic_numbers",
                "description": "Hard-coded values (100, 50, 0.2, etc.) without explanation",
                "line": "multiple",
                "severity": "low",
                "fix": "Define named constants for thresholds and rates"
            },
            {
                "issue_type": "error_handling",
                "description": "No validation for invalid inputs",
                "line": 1,
                "severity": "high",
                "fix": "Add input validation and error handling"
            },
            {
                "issue_type": "complexity",
                "description": "Nested if-else statements reduce readability",
                "line": "multiple",
                "severity": "medium",
                "fix": "Simplify logic flow and reduce nesting"
            }
        ]',
        path_id,
        1
    );

    -- Medium Level Challenge
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Input Validation Vulnerabilities',
        'Review this Python web API endpoint that handles user registration. Focus on identifying security vulnerabilities and input validation issues.

**Context**: User registration API endpoint
**Language**: Python (Flask)
**Time Limit**: 15 minutes

**Your Task**:
1. Identify all security vulnerabilities
2. Find input validation problems
3. Suggest secure coding practices
4. Provide improved implementation

**Focus Areas**:
- SQL injection prevention
- Input sanitization
- Password security
- Data validation
- Error information disclosure',
        'medium',
        'code_review',
        'from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

@app.route("/register", methods=["POST"])
def register_user():
    username = request.form["username"]
    email = request.form["email"]
    password = request.form["password"]
    
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    
    # Check if user exists
    query = f"SELECT * FROM users WHERE username = ''{username}''"
    cursor.execute(query)
    if cursor.fetchone():
        return jsonify({"error": "User already exists"}), 400
    
    # Insert new user
    insert_query = f"INSERT INTO users (username, email, password) VALUES (''{username}'', ''{email}'', ''{password}'')"
    cursor.execute(insert_query)
    conn.commit()
    conn.close()
    
    return jsonify({"message": "User registered successfully", "username": username}), 201',
        'from flask import Flask, request, jsonify
import sqlite3
import hashlib
import re
import secrets
from werkzeug.security import generate_password_hash

app = Flask(__name__)

def validate_email(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None

def validate_username(username):
    return (len(username) >= 3 and 
            len(username) <= 50 and 
            username.isalnum())

def validate_password(password):
    return (len(password) >= 8 and 
            any(c.isupper() for c in password) and
            any(c.islower() for c in password) and
            any(c.isdigit() for c in password))

@app.route("/register", methods=["POST"])
def register_user():
    try:
        # Validate required fields
        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        
        if not all([username, email, password]):
            return jsonify({"error": "All fields are required"}), 400
        
        # Validate input formats
        if not validate_username(username):
            return jsonify({"error": "Invalid username format"}), 400
            
        if not validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400
            
        if not validate_password(password):
            return jsonify({"error": "Password requirements not met"}), 400
        
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()
        
        # Use parameterized queries to prevent SQL injection
        cursor.execute("SELECT id FROM users WHERE username = ? OR email = ?", (username, email))
        if cursor.fetchone():
            return jsonify({"error": "User already exists"}), 400
        
        # Hash password securely
        password_hash = generate_password_hash(password)
        
        # Insert new user with parameterized query
        cursor.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            (username, email, password_hash)
        )
        conn.commit()
        
        return jsonify({"message": "User registered successfully"}), 201
        
    except Exception as e:
        # Log error internally, return generic message
        app.logger.error(f"Registration error: {str(e)}")
        return jsonify({"error": "Registration failed"}), 500
    finally:
        if conn:
            conn.close()',
        '[
            {
                "issue_type": "sql_injection",
                "description": "SQL injection vulnerability in user lookup and insert queries",
                "line": "10, 16",
                "severity": "critical",
                "fix": "Use parameterized queries with placeholders"
            },
            {
                "issue_type": "password_security",
                "description": "Passwords stored in plain text",
                "line": 16,
                "severity": "critical",
                "fix": "Hash passwords using secure algorithms like bcrypt or PBKDF2"
            },
            {
                "issue_type": "input_validation",
                "description": "No validation of input data format or length",
                "line": "4-6",
                "severity": "high",
                "fix": "Validate email format, username constraints, password strength"
            },
            {
                "issue_type": "error_handling",
                "description": "No error handling for database operations",
                "line": "multiple",
                "severity": "medium",
                "fix": "Add try-catch blocks and proper error responses"
            },
            {
                "issue_type": "information_disclosure",
                "description": "Detailed error messages may reveal system information",
                "line": 12,
                "severity": "medium",
                "fix": "Return generic error messages to users"
            },
            {
                "issue_type": "resource_management",
                "description": "Database connection not properly closed on errors",
                "line": "8-17",
                "severity": "medium",
                "fix": "Use try-finally or context managers for resource cleanup"
            }
        ]',
        path_id,
        2
    );

    -- Hard Level Challenge 1
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Performance and Memory Issues',
        'Review this Java service that processes large datasets. Identify performance bottlenecks, memory leaks, and inefficient algorithms.

**Context**: Data processing service for analytics
**Language**: Java
**Time Limit**: 20 minutes

**Your Task**:
1. Identify performance bottlenecks
2. Find potential memory leaks
3. Spot inefficient algorithms
4. Suggest optimization strategies

**Focus Areas**:
- Algorithm efficiency
- Memory management
- Resource cleanup
- Collection usage
- Stream processing',
        'hard',
        'code_review',
        'import java.util.*;
import java.io.*;

public class DataProcessor {
    private List<String> processedData = new ArrayList<>();
    private Map<String, Integer> cache = new HashMap<>();
    
    public void processLargeDataset(String filename) throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(filename));
        String line;
        
        while ((line = reader.readLine()) != null) {
            String[] parts = line.split(",");
            for (String part : parts) {
                String processed = expensiveOperation(part.trim());
                processedData.add(processed);
                
                // Update statistics
                updateStatistics(processed);
            }
        }
        
        // Sort all data
        Collections.sort(processedData);
        
        // Find duplicates
        List<String> duplicates = new ArrayList<>();
        for (int i = 0; i < processedData.size(); i++) {
            for (int j = i + 1; j < processedData.size(); j++) {
                if (processedData.get(i).equals(processedData.get(j))) {
                    duplicates.add(processedData.get(i));
                }
            }
        }
        
        System.out.println("Found " + duplicates.size() + " duplicates");
    }
    
    private String expensiveOperation(String input) {
        // Simulate expensive operation
        if (cache.containsKey(input)) {
            return cache.get(input).toString();
        }
        
        String result = input.toUpperCase().replace(" ", "_");
        cache.put(input, result.hashCode());
        return result;
    }
    
    private void updateStatistics(String data) {
        // This method is called for every item
        File statsFile = new File("stats.txt");
        try {
            FileWriter writer = new FileWriter(statsFile, true);
            writer.write(data + "\n");
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}',
        'import java.util.*;
import java.util.stream.Collectors;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

public class DataProcessor {
    private static final int BATCH_SIZE = 1000;
    private final Map<String, String> cache = new ConcurrentHashMap<>();
    private final Set<String> processedData = new TreeSet<>(); // Automatically sorted, no duplicates
    private final StringBuilder statsBuffer = new StringBuilder();
    private int statsCounter = 0;
    
    public void processLargeDataset(String filename) throws IOException {
        try (BufferedReader reader = Files.newBufferedReader(Paths.get(filename))) {
            reader.lines()
                .parallel() // Use parallel processing for large datasets
                .flatMap(line -> Arrays.stream(line.split(",")))
                .map(String::trim)
                .filter(part -> !part.isEmpty())
                .map(this::expensiveOperation)
                .forEach(this::addProcessedData);
        }
        
        // Flush remaining stats
        flushStats();
        
        System.out.println("Processed " + processedData.size() + " unique items");
    }
    
    private synchronized void addProcessedData(String processed) {
        processedData.add(processed);
        updateStatistics(processed);
    }
    
    private String expensiveOperation(String input) {
        return cache.computeIfAbsent(input, key -> {
            // Simulate expensive operation
            return key.toUpperCase().replace(" ", "_");
        });
    }
    
    private synchronized void updateStatistics(String data) {
        statsBuffer.append(data).append("\n");
        statsCounter++;
        
        // Batch write to reduce I/O operations
        if (statsCounter >= BATCH_SIZE) {
            flushStats();
        }
    }
    
    private void flushStats() {
        if (statsBuffer.length() > 0) {
            try {
                Files.write(
                    Paths.get("stats.txt"), 
                    statsBuffer.toString().getBytes(),
                    StandardOpenOption.CREATE, 
                    StandardOpenOption.APPEND
                );
                statsBuffer.setLength(0);
                statsCounter = 0;
            } catch (IOException e) {
                System.err.println("Failed to write stats: " + e.getMessage());
            }
        }
    }
    
    // Method to clear cache when needed
    public void clearCache() {
        cache.clear();
    }
    
    // Method to get processed data size without exposing internal collection
    public int getProcessedDataSize() {
        return processedData.size();
    }
}',
        '[
            {
                "issue_type": "resource_leak",
                "description": "BufferedReader not closed properly",
                "line": 8,
                "severity": "high",
                "fix": "Use try-with-resources statement"
            },
            {
                "issue_type": "memory_leak",
                "description": "Unbounded cache growth can cause OutOfMemoryError",
                "line": 6,
                "severity": "high",
                "fix": "Implement cache size limits or use LRU cache"
            },
            {
                "issue_type": "performance",
                "description": "O(n²) duplicate detection algorithm",
                "line": "25-31",
                "severity": "high",
                "fix": "Use Set for automatic duplicate removal or HashSet for O(n) detection"
            },
            {
                "issue_type": "io_performance",
                "description": "File I/O operation for every processed item",
                "line": "42-48",
                "severity": "high",
                "fix": "Batch write operations or use buffered writing"
            },
            {
                "issue_type": "algorithm_efficiency",
                "description": "Unnecessary sorting of large dataset",
                "line": 19,
                "severity": "medium",
                "fix": "Use TreeSet for automatic sorting or sort only when needed"
            },
            {
                "issue_type": "memory_usage",
                "description": "Loading entire dataset into memory",
                "line": 11,
                "severity": "medium",
                "fix": "Process data in streams or batches"
            },
            {
                "issue_type": "thread_safety",
                "description": "Shared mutable state without synchronization",
                "line": "5-6",
                "severity": "medium",
                "fix": "Use thread-safe collections or synchronization"
            }
        ]',
        path_id,
        3
    );

    -- Hard Level Challenge 2
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Concurrency and Race Conditions',
        'Review this C# banking system that handles concurrent transactions. Identify race conditions, deadlock potential, and thread safety issues.

**Context**: Banking transaction processing system
**Language**: C#
**Time Limit**: 25 minutes

**Your Task**:
1. Identify race conditions
2. Find deadlock scenarios
3. Spot thread safety violations
4. Suggest concurrency solutions

**Focus Areas**:
- Thread synchronization
- Atomic operations
- Lock ordering
- Resource contention
- Data consistency',
        'hard',
        'code_review',
        'using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public class BankAccount {
    private decimal balance;
    private readonly object lockObject = new object();
    
    public decimal Balance => balance;
    
    public void Deposit(decimal amount) {
        balance += amount;
        Console.WriteLine("Deposited " + amount + ", new balance: " + balance);
    }
    
    public bool Withdraw(decimal amount) {
        if (balance >= amount) {
            Thread.Sleep(10); // Simulate processing time
            balance -= amount;
            Console.WriteLine("Withdrew " + amount + ", new balance: " + balance);
            return true;
        }
        return false;
    }
}

public class TransferService {
    private static Dictionary<int, BankAccount> accounts = new Dictionary<int, BankAccount>();
    private static int transactionId = 0;
    
    public static void CreateAccount(int accountId, decimal initialBalance) {
        accounts[accountId] = new BankAccount();
        accounts[accountId].Deposit(initialBalance);
    }
    
    public static bool Transfer(int fromAccountId, int toAccountId, decimal amount) {
        var fromAccount = accounts[fromAccountId];
        var toAccount = accounts[toAccountId];
        
        lock (fromAccount) {
            if (fromAccount.Withdraw(amount)) {
                lock (toAccount) {
                    toAccount.Deposit(amount);
                    transactionId++;
                    Console.WriteLine("Transfer " + transactionId + " completed");
                    return true;
                }
            }
        }
        return false;
    }
    
    public static decimal GetTotalBalance() {
        decimal total = 0;
        foreach (var account in accounts.Values) {
            total += account.Balance;
        }
        return total;
    }
}',
        'using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public class BankAccount {
    private decimal _balance;
    private readonly object _lockObject = new object();
    private readonly int _accountId;
    
    public BankAccount(int accountId, decimal initialBalance = 0) {
        _accountId = accountId;
        _balance = initialBalance;
    }
    
    public int AccountId => _accountId;
    
    public decimal Balance {
        get {
            lock (_lockObject) {
                return _balance;
            }
        }
    }
    
    public void Deposit(decimal amount) {
        if (amount <= 0) throw new ArgumentException("Amount must be positive");
        
        lock (_lockObject) {
            _balance += amount;
            Console.WriteLine("Account " + _accountId + ": Deposited " + amount + ", new balance: " + _balance);
        }
    }
    
    public bool Withdraw(decimal amount) {
        if (amount <= 0) throw new ArgumentException("Amount must be positive");
        
        lock (_lockObject) {
            if (_balance >= amount) {
                // Simulate processing time while holding lock
                Thread.Sleep(10);
                _balance -= amount;
                Console.WriteLine("Account " + _accountId + ": Withdrew " + amount + ", new balance: " + _balance);
                return true;
            }
            return false;
        }
    }
}

public class TransferService {
    private static readonly ConcurrentDictionary<int, BankAccount> _accounts = 
        new ConcurrentDictionary<int, BankAccount>();
    private static long _transactionId = 0;
    private static readonly object _totalBalanceLock = new object();
    
    public static void CreateAccount(int accountId, decimal initialBalance) {
        var account = new BankAccount(accountId, initialBalance);
        _accounts.TryAdd(accountId, account);
    }
    
    public static bool Transfer(int fromAccountId, int toAccountId, decimal amount) {
        if (fromAccountId == toAccountId) return false;
        if (amount <= 0) return false;
        
        if (!_accounts.TryGetValue(fromAccountId, out var fromAccount) ||
            !_accounts.TryGetValue(toAccountId, out var toAccount)) {
            return false;
        }
        
        // Prevent deadlock by always acquiring locks in consistent order
        var firstLock = fromAccountId < toAccountId ? fromAccount : toAccount;
        var secondLock = fromAccountId < toAccountId ? toAccount : fromAccount;
        
        lock (firstLock._lockObject) {
            lock (secondLock._lockObject) {
                if (fromAccount.Withdraw(amount)) {
                    toAccount.Deposit(amount);
                    var txId = Interlocked.Increment(ref _transactionId);
                    Console.WriteLine("Transfer " + txId + " completed: " + fromAccountId + " -> " + toAccountId + ", amount: " + amount);
                    return true;
                }
            }
        }
        return false;
    }
    
    public static decimal GetTotalBalance() {
        lock (_totalBalanceLock) {
            decimal total = 0;
            foreach (var account in _accounts.Values) {
                total += account.Balance;
            }
            return total;
        }
    }
}',
        '[
            {
                "issue_type": "race_condition",
                "description": "Balance property read without synchronization",
                "line": 9,
                "severity": "high",
                "fix": "Protect balance reads with lock or use volatile/Interlocked"
            },
            {
                "issue_type": "race_condition",
                "description": "Deposit method modifies balance without synchronization",
                "line": "11-14",
                "severity": "critical",
                "fix": "Use lock around balance modification"
            },
            {
                "issue_type": "race_condition",
                "description": "Check-then-act race condition in Withdraw",
                "line": "16-22",
                "severity": "critical",
                "fix": "Perform check and withdrawal atomically under lock"
            },
            {
                "issue_type": "deadlock",
                "description": "Potential deadlock in Transfer method with nested locks",
                "line": "34-42",
                "severity": "critical",
                "fix": "Always acquire locks in consistent order (e.g., by account ID)"
            },
            {
                "issue_type": "thread_safety",
                "description": "Static dictionary not thread-safe for concurrent access",
                "line": 26,
                "severity": "high",
                "fix": "Use ConcurrentDictionary for thread-safe operations"
            },
            {
                "issue_type": "race_condition",
                "description": "transactionId increment not atomic",
                "line": 40,
                "severity": "medium",
                "fix": "Use Interlocked.Increment for atomic increment"
            },
            {
                "issue_type": "race_condition",
                "description": "GetTotalBalance reads balances without synchronization",
                "line": "46-52",
                "severity": "high",
                "fix": "Acquire locks on all accounts or use snapshot approach"
            }
        ]',
        path_id,
        4
    );

    -- Hard Level Challenge 3
    INSERT INTO challenges (title, description, difficulty, challenge_type, initial_code, solution_code, test_cases, path_id, order_index) VALUES 
    (
        'Architecture and Design Patterns',
        'Review this TypeScript e-commerce system that violates multiple design principles. Identify architectural issues, design pattern misuse, and SOLID principle violations.

**Context**: E-commerce order processing system
**Language**: TypeScript
**Time Limit**: 30 minutes

**Your Task**:
1. Identify SOLID principle violations
2. Find design pattern misuse
3. Spot architectural issues
4. Suggest better design approaches

**Focus Areas**:
- Single Responsibility Principle
- Dependency Injection
- Interface Segregation
- Design pattern implementation
- Separation of concerns',
        'hard',
        'code_review',
        'class OrderProcessor {
    private database: any;
    private emailService: any;
    private paymentGateway: any;
    private inventoryService: any;
    private logger: any;
    
    constructor() {
        this.database = new MySQLDatabase();
        this.emailService = new SMTPEmailService();
        this.paymentGateway = new StripePaymentGateway();
        this.inventoryService = new InventoryService();
        this.logger = new FileLogger();
    }
    
    processOrder(orderData: any): boolean {
        try {
            // Validate order
            if (!orderData.customerId || !orderData.items || orderData.items.length === 0) {
                this.logger.log("Invalid order data");
                return false;
            }
            
            // Calculate total
            let total = 0;
            for (let item of orderData.items) {
                if (item.price < 0) {
                    this.logger.log("Invalid item price");
                    return false;
                }
                total += item.price * item.quantity;
                
                // Check inventory
                if (!this.inventoryService.checkStock(item.productId, item.quantity)) {
                    this.logger.log("Insufficient stock for " + item.productId);
                    return false;
                }
            }
            
            // Apply discounts
            if (orderData.customerId === "premium") {
                total = total * 0.9;
            } else if (orderData.customerId === "vip") {
                total = total * 0.8;
            }
            
            // Process payment
            const paymentResult = this.paymentGateway.charge(orderData.paymentMethod, total);
            if (!paymentResult.success) {
                this.logger.log("Payment failed: " + paymentResult.error);
                return false;
            }
            
            // Update inventory
            for (let item of orderData.items) {
                this.inventoryService.reduceStock(item.productId, item.quantity);
            }
            
            // Save order to database
            const order = {
                id: Math.random().toString(),
                customerId: orderData.customerId,
                items: orderData.items,
                total: total,
                status: "completed",
                createdAt: new Date()
            };
            this.database.save("orders", order);
            
            // Send confirmation email
            const emailBody = "Your order " + order.id + " has been processed. Total: $" + total;
            this.emailService.send(orderData.customerEmail, "Order Confirmation", emailBody);
            
            this.logger.log("Order processed successfully: " + order.id);
            return true;
            
        } catch (error) {
            this.logger.log("Error processing order: " + error.message);
            return false;
        }
    }
    
    getOrderHistory(customerId: string): any[] {
        return this.database.query("SELECT * FROM orders WHERE customerId = ?", [customerId]);
    }
    
    cancelOrder(orderId: string): boolean {
        const order = this.database.findById("orders", orderId);
        if (!order) return false;
        
        // Refund payment
        this.paymentGateway.refund(order.paymentId, order.total);
        
        // Restore inventory
        for (let item of order.items) {
            this.inventoryService.addStock(item.productId, item.quantity);
        }
        
        // Update order status
        order.status = "cancelled";
        this.database.update("orders", order);
        
        // Send cancellation email
        this.emailService.send(order.customerEmail, "Order Cancelled", "Order " + orderId + " has been cancelled");
        
        return true;
    }
}',
        'interface IDatabase {
    save(table: string, data: any): Promise<string>;
    findById(table: string, id: string): Promise<any>;
    query(sql: string, params: any[]): Promise<any[]>;
    update(table: string, data: any): Promise<void>;
}

interface IEmailService {
    send(to: string, subject: string, body: string): Promise<void>;
}

interface IPaymentGateway {
    charge(paymentMethod: any, amount: number): Promise<PaymentResult>;
    refund(paymentId: string, amount: number): Promise<PaymentResult>;
}

interface IInventoryService {
    checkStock(productId: string, quantity: number): Promise<boolean>;
    reduceStock(productId: string, quantity: number): Promise<void>;
    addStock(productId: string, quantity: number): Promise<void>;
}

interface ILogger {
    log(message: string): void;
    error(message: string): void;
}

interface IDiscountStrategy {
    calculateDiscount(total: number, customer: Customer): number;
}

class PremiumDiscountStrategy implements IDiscountStrategy {
    calculateDiscount(total: number, customer: Customer): number {
        return total * 0.1; // 10% discount
    }
}

class VIPDiscountStrategy implements IDiscountStrategy {
    calculateDiscount(total: number, customer: Customer): number {
        return total * 0.2; // 20% discount
    }
}

class OrderValidator {
    validate(orderData: OrderData): ValidationResult {
        const errors: string[] = [];
        
        if (!orderData.customerId) {
            errors.push("Customer ID is required");
        }
        
        if (!orderData.items || orderData.items.length === 0) {
            errors.push("Order must contain at least one item");
        }
        
        for (const item of orderData.items || []) {
            if (item.price < 0) {
                errors.push("Invalid price for item " + item.productId);
            }
            if (item.quantity <= 0) {
                errors.push("Invalid quantity for item " + item.productId);
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

class OrderCalculator {
    constructor(private discountStrategy: IDiscountStrategy) {}
    
    calculateTotal(items: OrderItem[], customer: Customer): number {
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = this.discountStrategy.calculateDiscount(subtotal, customer);
        return subtotal - discount;
    }
}

class OrderProcessor {
    constructor(
        private database: IDatabase,
        private emailService: IEmailService,
        private paymentGateway: IPaymentGateway,
        private inventoryService: IInventoryService,
        private logger: ILogger,
        private validator: OrderValidator,
        private calculator: OrderCalculator
    ) {}
    
    async processOrder(orderData: OrderData): Promise<ProcessOrderResult> {
        try {
            // Validate order
            const validation = this.validator.validate(orderData);
            if (!validation.isValid) {
                this.logger.error("Order validation failed: " + validation.errors.join(", "));
                return { success: false, errors: validation.errors };
            }
            
            // Check inventory availability
            const inventoryCheck = await this.checkInventoryAvailability(orderData.items);
            if (!inventoryCheck.available) {
                this.logger.error("Insufficient inventory: " + inventoryCheck.unavailableItems.join(", "));
                return { success: false, errors: ["Insufficient inventory"] };
            }
            
            // Calculate total
            const customer = await this.getCustomer(orderData.customerId);
            const total = this.calculator.calculateTotal(orderData.items, customer);
            
            // Process payment
            const paymentResult = await this.paymentGateway.charge(orderData.paymentMethod, total);
            if (!paymentResult.success) {
                this.logger.error("Payment failed: " + paymentResult.error);
                return { success: false, errors: ["Payment processing failed"] };
            }
            
            // Create and save order
            const order = await this.createOrder(orderData, total, paymentResult.transactionId);
            
            // Update inventory
            await this.updateInventory(orderData.items);
            
            // Send confirmation
            await this.sendOrderConfirmation(order);
            
            this.logger.log("Order processed successfully: " + order.id);
            return { success: true, orderId: order.id };
            
        } catch (error) {
            this.logger.error("Error processing order: " + error.message);
            return { success: false, errors: ["Internal server error"] };
        }
    }
    
    private generateOrderId(): string {
        return "ORD-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    }
}',
        '[
            {
                "issue_type": "solid_violation",
                "description": "Single Responsibility Principle violation - OrderProcessor handles validation, calculation, payment, inventory, email, and persistence",
                "line": "1-80",
                "severity": "high",
                "fix": "Split into separate classes: OrderValidator, OrderCalculator, PaymentProcessor, etc."
            },
            {
                "issue_type": "dependency_injection",
                "description": "Hard-coded dependencies in constructor violate Dependency Inversion Principle",
                "line": "7-13",
                "severity": "high",
                "fix": "Inject interfaces instead of concrete implementations"
            },
            {
                "issue_type": "open_closed_violation",
                "description": "Discount logic hard-coded, not extensible for new customer types",
                "line": "35-39",
                "severity": "medium",
                "fix": "Use Strategy pattern for discount calculation"
            },
            {
                "issue_type": "error_handling",
                "description": "Generic error handling loses important error information",
                "line": "66-69",
                "severity": "medium",
                "fix": "Implement specific error types and proper error propagation"
            },
            {
                "issue_type": "data_validation",
                "description": "Weak validation logic mixed with business logic",
                "line": "16-20",
                "severity": "medium",
                "fix": "Extract validation to separate validator class"
            },
            {
                "issue_type": "magic_values",
                "description": "Magic strings and numbers throughout the code",
                "line": "multiple",
                "severity": "low",
                "fix": "Define constants and enums for status values and discount rates"
            },
            {
                "issue_type": "async_handling",
                "description": "Synchronous operations that should be asynchronous",
                "line": "multiple",
                "severity": "medium",
                "fix": "Make database and external service calls async"
            },
            {
                "issue_type": "id_generation",
                "description": "Weak ID generation using Math.random()",
                "line": 52,
                "severity": "medium",
                "fix": "Use proper UUID generation or database auto-increment"
            }
        ]',
        path_id,
        5
    );
END $$;