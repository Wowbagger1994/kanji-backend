# Variables
DOCKER_COMPOSE_FILE=docker-compose.yml
PYTHON=python3
PRISMA=prisma
KANJI_LOADER_DIR=kanji-loader
KANJI_LOADER_SCRIPT=kanji_loader.py
LOG_ERROR=log_error.log
LOG_NEST_ERROR=log_nest_error.log

# Color variables for beautification
COLOR_RESET=\033[0m
COLOR_GREEN=\033[32m
COLOR_YELLOW=\033[33m
COLOR_BLUE=\033[34m
COLOR_RED=\033[31m
COLOR_BOLD=\033[1m

# Emoji symbols for output
SUCCESS=✔️
ERROR=❌
RUN=🔄
DONE=✅

# Spinner function for loading indication
spinner = while kill -0 $$pid 2>/dev/null; do \
            i=$$(( (i+1) %4 )); \
            spinner_chars="|/-\\"; \
            printf "\r$(COLOR_BLUE)$(RUN) %s$(COLOR_RESET)" "$${spinner_chars:$$i:1}"; \
            sleep 0.1; \
          done; \
          printf "\r"

define print_result
			   if [ $$? -eq 0 ]; then \
				 echo "$(COLOR_GREEN)$(SUCCESS) $1$(COLOR_RESET)"; \
			   else \
				 echo "$(COLOR_RED)$(ERROR) $2 See $(LOG_ERROR) for details.$(COLOR_RESET)"; \
				 exit 1; \
			   fi
endef

# Install Python dependencies inside kanji-loader
install-python-requirements:
	@echo "$(COLOR_BLUE)$(RUN) Installing Python requirements...$(COLOR_RESET)"
	@pip install -r $(KANJI_LOADER_DIR)/requirements.txt > /dev/null 2>>$(LOG_ERROR) & pid=$$!; \
	$(spinner); \
	wait $$pid; \
	$(call print_result, Python requirements installed., Failed to install Python requirements.)

# Install npm packages
install-npm:
	@echo "$(COLOR_BLUE)$(RUN) Installing npm packages...$(COLOR_RESET)"
	@npm install > /dev/null 2>>$(LOG_ERROR) & pid=$$!; \
	$(spinner); \
	wait $$pid; \
	$(call print_result, npm packages installed., Failed to install npm packages.)

# Run Docker Compose
docker-compose-up:
	@echo "$(COLOR_BLUE)$(RUN) Running Docker Compose...$(COLOR_RESET)"
	@docker-compose -f $(DOCKER_COMPOSE_FILE) up -d > /dev/null 2>>$(LOG_ERROR) & pid=$$!; \
	$(spinner); \
	wait $$pid; \
	$(call print_result, Docker Compose started., Failed to start Docker Compose.)

# Run Prisma migration
prisma-migrate:
	@echo "$(COLOR_BLUE)$(RUN) Running Prisma migrations...$(COLOR_RESET)"
	@npx $(PRISMA) migrate dev > /dev/null 2>>$(LOG_ERROR) & pid=$$!; \
	$(spinner); \
	wait $$pid; \
	$(call print_result, Prisma migrations executed successfully., Failed to execute Prisma migrations.)

# Run the Python script inside kanji-loader
run-kanji-loader:
	@echo "$(COLOR_BLUE)$(RUN) Running kanji_loader.py...$(COLOR_RESET)"
	@$(PYTHON) $(KANJI_LOADER_DIR)/$(KANJI_LOADER_SCRIPT) > /dev/null 2>>$(LOG_ERROR) & pid=$$!; \
	$(spinner); \
	wait $$pid; \
	$(call print_result, kanji_loader.py executed successfully., Failed to execute kanji_loader.py.)

# Run the nestjs backend
run-kanji-backend:
	@echo "$(COLOR_BLUE)$(RUN) Running nestJS backend...$(COLOR_RESET)"
	@npm run start 2>>$(LOG_NEST_ERROR) & pid=$$!; \
	$(spinner); \
	wait $$pid; \
	$(call print_result, Backend executed successfully., Failed to execute backend.)

# Full setup and execution
all: install-python-requirements install-npm docker-compose-up prisma-migrate run-kanji-loader

# Run Docker Compose
up: docker-compose-up

# Execute Beackend
start: up run-kanji-backend

# Clean up Docker containers (stopping only)
down:
	@echo "$(COLOR_YELLOW)$(RUN) Stopping Docker containers...$(COLOR_RESET)"
	@docker-compose -f $(DOCKER_COMPOSE_FILE) down > /dev/null 2>>$(LOG_ERROR) & pid=$$!; \
	$(spinner); \
	wait $$pid; \
	$(call print_result, Docker containers stopped., Failed to stop Docker containers.)

# Clean up the environment
clean: down
	@echo "$(COLOR_YELLOW)$(RUN) Cleaning up environment...$(COLOR_RESET)"
	@rm -rf node_modules > /dev/null 2>>$(LOG_ERROR) & pid=$$!; \
	$(spinner); \
	wait $$pid; \
	$(call print_result, node_modules cleaned., Failed to clean node_modules.)
	@find . -name '__pycache__' -exec rm -rf {} + > /dev/null 2>>$(LOG_ERROR) & pid=$$!; \
	$(spinner); \
	wait $$pid; \
	$(call print_result, __pycache__ cleaned., Failed to clean __pycache__.)
	@find . -name '*.pyc' -exec rm -f {} + > /dev/null 2>>$(LOG_ERROR) & pid=$$!; \
	$(spinner); \
	wait $$pid; \
	$(call print_result, .pyc files cleaned., Failed to clean .pyc files.)
	@rm -rf migrations > /dev/null 2>>$(LOG_ERROR) & pid=$$!; \
	$(spinner); \
	wait $$pid; \
	$(call print_result, migrations cleaned., Failed to clean migrations.)
	@echo "$(COLOR_GREEN)$(DONE) Environment cleaned.$(COLOR_RESET)"

# Force clean: removes containers, networks, volumes, images
fclean: clean
	@echo "$(COLOR_RED)$(RUN) Force cleaning Docker containers, volumes, networks, and images...$(COLOR_RESET)"
	@docker-compose -f $(DOCKER_COMPOSE_FILE) down --volumes --rmi all --remove-orphans > /dev/null 2>>$(LOG_ERROR) & pid=$$!; \
	$(spinner); \
	wait $$pid; \
	$(call print_result, Docker environment force cleaned., Failed to force clean Docker environment.)

.PHONY: install-python-requirements install-npm docker-compose-up prisma-migrate run-kanji-loader all down clean fclean
