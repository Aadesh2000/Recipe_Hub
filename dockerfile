FROM eclipse-temurin:21-jdk-focal

WORKDIR /app

# Copy everything
COPY . .

# Build your backend
WORKDIR /app/backend
RUN mvn clean package

# Run the jar
CMD ["java", "-jar", "target/recipe_hub.jar"]
