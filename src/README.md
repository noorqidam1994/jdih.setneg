# JDIH (Jaringan Dokumentasi dan Informasi Hukum)

A comprehensive legal information system for the Indonesian Ministry of State Secretariat, built with Next.js, Express.js, and MySQL.

## 🏗️ Project Analysis

### **Technology Stack**

- **Frontend**: Next.js 14.2.29 with React 18.2.0
- **Backend**: Express.js server with custom routing
- **Database**: MySQL with Knex.js ORM
- **Styling**: Bootstrap, MDB (Material Design Bootstrap), custom CSS
- **Charts**: AmCharts 4 for data visualization
- **File Handling**: Formidable for file uploads
- **Deployment**: Docker support

### **Key Features**

- 📄 **Legal Document Management** - Upload and manage legal documents
- ⚖️ **Court Decisions** - Manage court decisions and rulings
- 📚 **Legal Monographs** - Academic legal writings
- 📰 **Legal Articles** - News and articles
- 🖼️ **Gallery** - Image management
- 📖 **E-books** - Digital book management
- 📊 **Statistics** - Charts and analytics
- 📞 **Contact Forms** - User inquiries

### **Project Structure**

```
jdih/
├── src/                    # Main application directory
│   ├── components/         # React components
│   ├── pages/             # Next.js pages and API routes
│   ├── lib/               # Utility libraries
│   ├── config/            # Configuration files
│   ├── public/            # Static assets
│   ├── db_jdih.sql        # Database schema and data
│   ├── env.example        # Environment variables template
│   ├── knexfile.js        # Database configuration
│   └── server.js          # Express server
├── docker-compose.yml     # Docker configuration
├── Dockerfile            # Docker image definition
├── setup.sh              # Automated setup script
├── SETUP.md              # Detailed setup guide
└── README.md             # This file
```

## 🚀 Quick Start

### **Prerequisites**

- Node.js v18+ and npm v8+
- MySQL 8.0+
- Git

### **1. Clone and Setup**

```bash
# Clone the repository
git clone <repository-url>
cd jdih

# Run automated setup script
./setup.sh
```

### **2. Manual Setup (Alternative)**

#### **Navigate to src directory**

```bash
cd src
```

#### **Install dependencies**

```bash
npm install
```

#### **Environment Configuration**

```bash
# Copy environment template
cp env.example .env

# Edit .env with your settings
nano .env
```

**Required Environment Variables:**

```env
# Database Configuration
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=jdih
DB_PORT=3306

# Application Configuration
NODE_ENV=development
PORT=3000

# File Storage Path (IMPORTANT: Use absolute path)
NEXT_APP_JDIH_PATH=/absolute/path/to/your/jdih/files/

# Security
TOKEN_SECRET=your_secret_token_here
```

### **3. Database Setup**

#### **Option A: Using the provided database dump (Recommended)**

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE jdih CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import complete database (schema + data)
mysql -u root -p jdih < db_jdih.sql
```

#### **Option B: Create database manually**

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE jdih CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# The application will create tables automatically on first run
```

### **4. File Directory Setup**

```bash
# Create required directories (replace with your desired path)
mkdir -p /path/to/your/jdih/files/{uploads,Putusanpengadilan,Monografihukum,Artikelhukum,Galeri,e_book,Abstrak,source,filekontak}

# Set proper permissions
chmod 755 /path/to/your/jdih/files/
```

**Directory Structure:**

```
/path/to/your/jdih/files/
├── uploads/           # Legal documents (PDFs)
├── Putusanpengadilan/ # Court decisions
├── Monografihukum/    # Legal monographs
├── Artikelhukum/      # Legal articles
├── Galeri/           # Gallery images
├── e_book/           # E-books
├── Abstrak/          # Abstracts
├── source/           # Source files
└── filekontak/       # Contact form files
```

### **5. Run the Application**

#### **Development Mode**

```bash
npm run dev
```

#### **Production Mode**

```bash
npm run build
npm run start
```

#### **Using Docker**

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or manually
docker build -t jdih-app .
docker run -p 3000:3000 jdih-app
```

## 📋 Available Scripts

### **Root Directory**

- `./setup.sh` - Run automated setup script
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run docker-build` - Build Docker image
- `npm run docker-run` - Run Docker container

### **Source Directory**

- `npm run dev` - Start development server
- `npm run build` - Build Next.js application
- `npm run start` - Start production server

## 🔧 Configuration

### **Database Configuration**

The application uses Knex.js for database operations. Configuration is in `src/knexfile.js`:

```javascript
// Development
{
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "your_password",
    database: "jdih",
    port: "3306"
  }
}
```

### **File Storage**

Set `NEXT_APP_JDIH_PATH` in your `.env` file to point to your file storage directory:

**Important:** Use absolute paths, not relative paths.

```env
# Correct
NEXT_APP_JDIH_PATH=/Users/username/jdih-files/

# Incorrect
NEXT_APP_JDIH_PATH=./files/
```

## 🗄️ Database Schema

### **Database Export**

The current database has been exported to `src/db_jdih.sql` and includes:

- Complete database schema
- Sample data for testing
- All required tables and relationships

### **Key Tables**

- `jenis` - Document types (UU, PP, PERPRES, etc.)
- `peraturan` - Legal regulations
- `putusan` - Court decisions
- `monografi` - Legal monographs
- `artikel` - Legal articles
- `galeri` - Gallery items
- `ebook` - E-books
- `kontak` - Contact submissions

### **Import Database**

```bash
# Import complete database
mysql -u root -p jdih < src/db_jdih.sql

# Verify import
mysql -u root -p -e "USE jdih; SHOW TABLES;"
```

## 🔍 API Endpoints

### **Legal Products**

- `POST /api/hukumproduk/produkhukum` - Get legal products
- `POST /api/hukumproduk/apimatriks` - Get matrix data
- `GET /api/hukumproduk/pdf` - Download PDF
- `GET /api/hukumproduk/detaildata` - Get detailed data

### **Court Decisions**

- `POST /api/putusan/putusan_p` - Get court decisions
- `GET /api/putusan/pdfputusan` - Download decision PDF
- `GET /api/putusan/dataterkait` - Get related data

### **Gallery**

- `POST /api/galeri/data_glr` - Get gallery data
- `GET /api/galeri/cariimg` - Get gallery images

### **E-books**

- `POST /api/ebook/listebook` - Get e-book list
- `GET /api/ebook/pdf` - Download e-book

### **Legal Articles**

- `POST /api/artikelhukum/artikelall` - Get all articles
- `GET /api/artikelhukum/jns` - Get article types

### **Legal Monographs**

- `POST /api/monografi/apidata` - Get monograph data
- `GET /api/monografi/jns` - Get monograph types

## 🐛 Troubleshooting

### **Common Issues**

#### **1. Database Connection Error**

```bash
# Check MySQL status
brew services list | grep mysql

# Start MySQL if stopped
brew services start mysql

# Test connection
mysql -u root -p

# Verify database exists
mysql -u root -p -e "SHOW DATABASES;" | grep jdih
```

#### **2. Serialization Error in getServerSideProps**

If you see: `Error serializing .data.isiTable.result returned from getServerSideProps`

- This has been fixed in the latest version
- Ensure you're using the updated code with proper null checks

#### **3. Port Already in Use**

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

#### **4. File Upload Issues**

```bash
# Check directory permissions
ls -la /path/to/your/jdih/files/

# Set proper permissions
chmod 755 /path/to/your/jdih/files/

# Verify NEXT_APP_JDIH_PATH in .env
echo $NEXT_APP_JDIH_PATH
```

#### **5. Build Errors**

```bash
# Clear cache
rm -rf .next
rm -rf node_modules

# Reinstall dependencies
npm install

# Try building again
npm run build
```

#### **6. Environment Variables Not Loading**

```bash
# Ensure .env file exists in src directory
ls -la src/.env

# Check if variables are being read
cat src/.env
```

### **Development Tips**

- Use `npm run dev` for hot reloading
- Check browser console for client-side errors
- Monitor server logs for backend issues
- Use Postman or similar tools to test API endpoints
- Check the Network tab in browser dev tools for API calls

## 🚀 Deployment

### **Production Environment Variables**

```env
NODE_ENV=production
NEXT_APP_DOMAIN=https://your-domain.com
NEXT_APP_JDIH_PATH=/var/www/jdih/files/
DB_HOST=your-production-db-host
DB_USERNAME=your-production-db-user
DB_PASSWORD=your-production-db-password
```

### **Security Considerations**

1. Change default database password
2. Use strong `TOKEN_SECRET`
3. Configure proper file permissions
4. Set up SSL/TLS certificates
5. Configure firewall rules
6. Use environment variables for sensitive data

### **Docker Deployment**

```bash
# Build image
docker build -t jdih-app .

# Run container
docker run -d -p 3000:3000 --name jdih-container jdih-app

# With environment file
docker run -d -p 3000:3000 --env-file .env jdih-app

# Using Docker Compose
docker-compose up -d
```

## 📚 Documentation

- **Setup Guide**: See `SETUP.md` for detailed setup instructions
- **API Documentation**: Check individual API files in `src/pages/api/`
- **Component Documentation**: See component files in `src/components/`
- **Database Schema**: See `src/db_jdih.sql` for complete database structure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

1. Check the console logs
2. Verify all prerequisites are met
3. Ensure proper file permissions
4. Review environment configuration
5. Check the troubleshooting section above
6. Ensure database is properly imported

### **Getting Help**

- Check the browser console for JavaScript errors
- Review server logs in the terminal
- Verify database connectivity
- Test API endpoints individually
- Ensure all environment variables are set correctly

---

**JDIH - Jaringan Dokumentasi dan Informasi Hukum**  
_Kementerian Sekretariat Negara Republik Indonesia_
