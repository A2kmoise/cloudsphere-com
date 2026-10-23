package rw.ac.rca.cloudsphere.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import rw.ac.rca.cloudsphere.catalog.Category;
import rw.ac.rca.cloudsphere.catalog.CategoryRepository;
import rw.ac.rca.cloudsphere.catalog.Product;
import rw.ac.rca.cloudsphere.catalog.ProductRepository;
import rw.ac.rca.cloudsphere.catalog.ProductStatus;
import rw.ac.rca.cloudsphere.commerce.DiscountCode;
import rw.ac.rca.cloudsphere.commerce.DiscountCodeRepository;
import rw.ac.rca.cloudsphere.identity.LoyaltyTier;
import rw.ac.rca.cloudsphere.identity.Role;
import rw.ac.rca.cloudsphere.identity.User;
import rw.ac.rca.cloudsphere.identity.UserRepository;
import rw.ac.rca.cloudsphere.identity.UserStatus;

import java.time.Instant;
import java.util.Set;

@Component
public class DataInitializer implements ApplicationRunner {

    public static final String DEMO_PASSWORD = "CloudSphere1";
    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final CloudSphereProperties properties;
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final CategoryRepository categories;
    private final ProductRepository products;
    private final DiscountCodeRepository discountCodes;

    public DataInitializer(CloudSphereProperties properties, UserRepository users, PasswordEncoder encoder,
                           CategoryRepository categories, ProductRepository products,
                           DiscountCodeRepository discountCodes) {
        this.properties = properties;
        this.users = users;
        this.encoder = encoder;
        this.categories = categories;
        this.products = products;
        this.discountCodes = discountCodes;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!properties.seed().enabled()) {
            return;
        }
        seedUser("demo@cloudsphere.rw", LoyaltyTier.STANDARD, UserStatus.ACTIVE, Set.of(Role.CUSTOMER));
        seedUser("gold@cloudsphere.rw", LoyaltyTier.GOLD, UserStatus.ACTIVE, Set.of(Role.CUSTOMER));
        User locked = seedUser("locked@cloudsphere.rw", LoyaltyTier.STANDARD, UserStatus.LOCKED, Set.of(Role.CUSTOMER));
        locked.setLockedUntil(Instant.now().plusSeconds(3600));
        users.save(locked);
        seedUser("ops@cloudsphere.rw", LoyaltyTier.STANDARD, UserStatus.ACTIVE, Set.of(Role.ADMIN));

        // BMW Category
        Category bmw = categories.findByNameIgnoreCase("BMW")
                .orElseGet(() -> categories.save(new Category("BMW")));
        seedProduct("BMW-M3-2024", "BMW M3 Competition", 85_000_000, 3, ProductStatus.PUBLISHED, bmw,
                "503 HP, 3.0L Twin-Turbo I6, 0-100 km/h in 3.5s. Ultimate driving machine with M Sport features.", 
                "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80");
        seedProduct("BMW-X5-2024", "BMW X5 xDrive40i", 95_000_000, 5, ProductStatus.PUBLISHED, bmw,
                "Luxury SAV with 335 HP, 3.0L Turbo I6. Spacious, powerful, and refined German engineering.", 
                "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80");
        seedProduct("BMW-I4-2024", "BMW i4 eDrive40", 78_000_000, 4, ProductStatus.PUBLISHED, bmw,
                "Electric Gran Coupe, 335 HP, 590 km range. Zero emissions with BMW performance DNA.", 
                "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80");
        seedProduct("BMW-330I-2024", "BMW 330i Sedan", 62_000_000, 7, ProductStatus.PUBLISHED, bmw,
                "255 HP, 2.0L Turbo I4, perfect balance of sport and luxury. Classic 3 Series excellence.", 
                "https://images.unsplash.com/photo-1523983302122-73e869e1f850?w=800&q=80");

        // Mercedes-Benz Category
        Category mercedes = categories.findByNameIgnoreCase("Mercedes-Benz")
                .orElseGet(() -> categories.save(new Category("Mercedes-Benz")));
        seedProduct("MB-C300-2024", "Mercedes-Benz C300", 68_000_000, 6, ProductStatus.PUBLISHED, mercedes,
                "255 HP, 2.0L Turbo, luxury and technology combined. MBUX infotainment with AI assistance.", 
                "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80");
        seedProduct("MB-EQS-2024", "Mercedes-Benz EQS 450+", 145_000_000, 2, ProductStatus.PUBLISHED, mercedes,
                "Electric luxury sedan, 329 HP, 725 km range. Hyperscreen MBUX and S-Class comfort.", 
                "https://images.unsplash.com/photo-1617531653520-bd466e4d4c16?w=800&q=80");
        seedProduct("MB-GLE-2024", "Mercedes-Benz GLE 450", 105_000_000, 4, ProductStatus.PUBLISHED, mercedes,
                "Luxury SUV, 362 HP, 3.0L Turbo I6 with EQ Boost. Air suspension and premium interior.", 
                "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80");
        seedProduct("MB-AMG-GT-2024", "Mercedes-AMG GT 63 S", 185_000_000, 1, ProductStatus.PUBLISHED, mercedes,
                "630 HP, 4.0L Twin-Turbo V8, 0-100 in 3.2s. Four-door coupe with AMG performance.", 
                "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&q=80");

        // Audi Category
        Category audi = categories.findByNameIgnoreCase("Audi")
                .orElseGet(() -> categories.save(new Category("Audi")));
        seedProduct("AUDI-A4-2024", "Audi A4 45 TFSI", 58_000_000, 8, ProductStatus.PUBLISHED, audi,
                "261 HP, 2.0L Turbo with Quattro AWD. Virtual Cockpit Plus and Matrix LED lights.", 
                "https://images.unsplash.com/photo-1610768764270-790fbec18178?w=800&q=80");
        seedProduct("AUDI-E-TRON-2024", "Audi e-tron GT", 135_000_000, 2, ProductStatus.PUBLISHED, audi,
                "Electric GT, 469 HP, 487 km range. Porsche Taycan platform with Audi luxury.", 
                "https://images.unsplash.com/photo-1614162692292-7ac56d7f35c5?w=800&q=80");
        seedProduct("AUDI-Q7-2024", "Audi Q7 55 TFSI", 98_000_000, 5, ProductStatus.PUBLISHED, audi,
                "335 HP, 3.0L V6 Turbo, 7-seater luxury SUV. Quattro AWD and air suspension.", 
                "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80");
        seedProduct("AUDI-RS6-2024", "Audi RS6 Avant", 165_000_000, 2, ProductStatus.PUBLISHED, audi,
                "591 HP, 4.0L Twin-Turbo V8 wagon. 0-100 in 3.6s with family practicality.", 
                "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800&q=80");

        // Porsche Category
        Category porsche = categories.findByNameIgnoreCase("Porsche")
                .orElseGet(() -> categories.save(new Category("Porsche")));
        seedProduct("POR-911-2024", "Porsche 911 Carrera", 155_000_000, 3, ProductStatus.PUBLISHED, porsche,
                "379 HP, 3.0L Twin-Turbo Flat-6. Iconic sports car with timeless design.", 
                "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80");
        seedProduct("POR-TAYCAN-2024", "Porsche Taycan 4S", 142_000_000, 3, ProductStatus.PUBLISHED, porsche,
                "Electric sports sedan, 469 HP, 463 km range. 800V charging and Porsche dynamics.", 
                "https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=800&q=80");
        seedProduct("POR-CAYENNE-2024", "Porsche Cayenne S", 125_000_000, 4, ProductStatus.PUBLISHED, porsche,
                "Luxury performance SUV, 434 HP, 2.9L Twin-Turbo V6. Sport Chrono package included.", 
                "https://images.unsplash.com/photo-1580414057402-61d55b5c8808?w=800&q=80");
        seedProduct("POR-MACAN-2024", "Porsche Macan GTS", 98_000_000, 5, ProductStatus.PUBLISHED, porsche,
                "Compact SUV, 434 HP, 2.9L V6 Twin-Turbo. Agile handling with Porsche DNA.", 
                "https://images.unsplash.com/photo-1611566026373-c6c8da0ea861?w=800&q=80");

        // Volkswagen Category
        Category vw = categories.findByNameIgnoreCase("Volkswagen")
                .orElseGet(() -> categories.save(new Category("Volkswagen")));
        seedProduct("VW-GOLF-2024", "Volkswagen Golf GTI", 45_000_000, 10, ProductStatus.PUBLISHED, vw,
                "241 HP, 2.0L Turbo, iconic hot hatch. Plaid seats and performance suspension.", 
                "https://images.unsplash.com/photo-1622126807280-9b5b32b28e88?w=800&q=80");
        seedProduct("VW-ID4-2024", "Volkswagen ID.4 Pro", 62_000_000, 6, ProductStatus.PUBLISHED, vw,
                "Electric SUV, 201 HP, 520 km range. Modern design with practical EV features.", 
                "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80");
        seedProduct("VW-TIGUAN-2024", "Volkswagen Tiguan R-Line", 52_000_000, 8, ProductStatus.PUBLISHED, vw,
                "Family SUV, 184 HP, 2.0L Turbo. Digital cockpit and spacious interior.", 
                "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80");
        seedProduct("VW-ARTEON-2024", "Volkswagen Arteon R", 78_000_000, 4, ProductStatus.PUBLISHED, vw,
                "315 HP, 2.0L Turbo with 4Motion AWD. Fastback sedan with premium features.", 
                "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80");

        if (discountCodes.findByCodeIgnoreCase("SAVE2026").isEmpty()) {
            DiscountCode code = new DiscountCode();
            code.setCode("SAVE2026");
            code.setPercentOff(10);
            code.setMinQty(1);
            code.setActive(true);
            discountCodes.save(code);
        }
        log.info("German car catalogue and demo accounts ready (password: {})", DEMO_PASSWORD);
    }

    private User seedUser(String email, LoyaltyTier tier, UserStatus status, Set<Role> roles) {
        return users.findByEmailIgnoreCase(email).orElseGet(() -> {
            User user = new User();
            user.setEmail(email);
            user.setPasswordHash(encoder.encode(DEMO_PASSWORD));
            user.setPhone("0780000000");
            user.setLoyaltyTier(tier);
            user.setStatus(status);
            user.setRoles(roles);
            return users.save(user);
        });
    }

    private void seedProduct(String sku, String name, long price, int stock, ProductStatus status, Category category,
                             String description, String imageUrl) {
        if (products.findBySkuIgnoreCase(sku).isPresent()) {
            return;
        }
        Product product = new Product();
        product.setSku(sku);
        product.setName(name);
        product.setDescription(description);
        product.setPriceRwf(price);
        product.setStockQty(stock);
        product.setStatus(status);
        product.setCategory(category);
        product.setImageUrl(imageUrl);
        products.save(product);
    }
}
