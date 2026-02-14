# Critical Files Protection

This document explains the safeguards in place to prevent accidental deletion of critical project files.

## Background

In February 2024, critical project files (including `package.json` and component files) were accidentally deleted during a local commit, causing the website to be unable to build and deploy. To prevent this from happening again, we've implemented multiple safeguards.

## Protected Files

The following files are considered critical and are validated before each deployment:

### Configuration Files
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Exact dependency versions
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

### Components
- `src/components/Logo.tsx` - Logo component
- `src/components/LandingContent.tsx` - Landing page content
- `src/components/WalletConnect.tsx` - Wallet connection UI
- `src/components/WalletContextProvider.tsx` - Wallet context provider
- `src/components/HamburgerMenu.tsx` - Mobile navigation menu
- `src/components/PaymentGate.tsx` - Payment processing UI
- `src/components/VanityGenerator.tsx` - Vanity address generator
- `src/components/ResultDisplay.tsx` - Result display component

### Pages
- `src/pages/_app.tsx` - Next.js app wrapper
- `src/pages/index.tsx` - Home page

### Styles
- `src/styles/globals.css` - Global styles

### Public Assets
- `public/SolGenLogo.png` - Main logo
- `public/favicon.png` - Favicon

## Safeguards

### 1. CI Validation Script

A validation script (`scripts/check-critical-files.sh`) runs before every build in GitHub Actions. This script:

- Checks for the existence of all critical files
- Fails the build immediately if any critical files are missing
- Provides a clear error message listing which files are missing

**Usage:**
```bash
bash scripts/check-critical-files.sh
```

### 2. GitHub Actions Workflow

The deployment workflow (`.github/workflows/deploy.yml`) includes a validation step that runs before installing dependencies or building the project. This ensures:

- Fast failure if critical files are missing (before wasting build time)
- Clear error messages in the GitHub Actions log
- Prevents deployment of broken code to production

### 3. Local Development Check

Developers can run the validation script locally before committing:

```bash
# Run validation
bash scripts/check-critical-files.sh

# If successful, proceed with commit
git add .
git commit -m "Your commit message"
git push
```

## Adding New Critical Files

If you add new files that are critical to the application's functionality, update the `CRITICAL_FILES` array in `scripts/check-critical-files.sh`:

```bash
CRITICAL_FILES=(
  # ... existing files ...
  "path/to/new/critical/file.tsx"
)
```

## Restoring Deleted Files

If critical files are accidentally deleted:

1. **Check git history** to find the last commit where the files existed
2. **Restore files** from git history:
   ```bash
   git log --all --full-history -- path/to/file
   git checkout <commit-hash> -- path/to/file
   ```
3. **Verify restoration** by running the validation script
4. **Test the build** to ensure everything works:
   ```bash
   npm install
   npm run build
   ```

## Prevention Best Practices

1. **Never use `git add -A` or `git add .` blindly** - review what you're staging with `git status`
2. **Use `.gitignore`** appropriately to exclude build artifacts and dependencies
3. **Review diffs before committing** with `git diff --staged`
4. **Run the validation script** before pushing changes
5. **Test builds locally** before pushing to ensure everything works

## Monitoring

The GitHub Actions workflow will automatically:
- Validate critical files on every push to `main`
- Fail the build immediately if files are missing
- Send notifications about failed builds

Check the Actions tab in GitHub to monitor build status and view detailed logs if validation fails.
