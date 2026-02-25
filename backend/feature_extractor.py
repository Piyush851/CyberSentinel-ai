import re
from urllib.parse import urlparse

def extract_url_features(url: str) -> list:
    """
    Takes a raw URL string and converts it into a 1D list of 9 numerical features.
    The order of these features strictly matches the Random Forest training data.
    """
    # 1. Defensive Check: Handle empty inputs safely
    if not url or not isinstance(url, str):
        # Return 9 zeros so the model doesn't crash, it will likely just predict 'Safe'
        return [[0, 0, 0, 0, 0, 0, 0, 0, 0]]

    # 2. URL Normalization
    url = url.strip()
    # If the user forgot http:// or https://, add a generic one so urlparse works correctly
    if not url.startswith(('http://', 'https://')):
        url_for_parsing = 'http://' + url
    else:
        url_for_parsing = url

    parsed_url = urlparse(url_for_parsing)
    domain = parsed_url.netloc

    # 3. Feature Calculations (Matching Kumkum's 9 Columns)
    
    # Feature 1: URLLength
    url_length = len(url)
    
    # Feature 2: DomainLength
    domain_length = len(domain)
    
    # Feature 3: IsDomainIP
    # Regex checks if the domain is strictly an IPv4 address (e.g., 192.168.1.1)
    ip_pattern = re.compile(r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$')
    is_domain_ip = 1 if ip_pattern.match(domain) else 0
    
    # Feature 4: NoOfSubDomain
    # A simple estimation: count the dots in the domain. 
    # 'google.com' has 1 dot (0 subdomains). 'mail.google.com' has 2 dots (1 subdomain).
    no_of_subdomain = max(0, domain.count('.') - 1)
    if is_domain_ip:
        no_of_subdomain = 0 # IPs don't have subdomains
        
    # Feature 5: NoOfLettersInURL
    no_of_letters = sum(c.isalpha() for c in url)
    
    # Feature 6: NoOfDegitsInURL (Note: Matching the typo "Degit" from your dataset)
    no_of_digits = sum(c.isdigit() for c in url)
    
    # Feature 7: NoOfEqualsInURL
    no_of_equals = url.count('=')
    
    # Feature 8: NoOfQMarkInURL
    no_of_qmark = url.count('?')
    
    # Feature 9: IsHTTPS
    is_https = 1 if parsed_url.scheme == 'https' or url.startswith('https://') else 0

    # 4. Return as a 2D Array (List of Lists)
    # Scikit-learn's .predict() expects a 2D array, e.g., [[feat1, feat2, ..., feat9]]
    features = [[
        url_length,
        domain_length,
        is_domain_ip,
        no_of_subdomain,
        no_of_letters,
        no_of_digits,
        no_of_equals,
        no_of_qmark,
        is_https
    ]]
    
    return features

# --- QUICK TEST BLOCK (Mahi can run this locally to verify) ---
if __name__ == "__main__":
    test_url = "https://secure-login.bank.com/update?user=123"
    print(f"Testing URL: {test_url}")
    # Expected output should be a 2D list of 9 integers
    print(f"Extracted Features: {extract_url_features(test_url)}")