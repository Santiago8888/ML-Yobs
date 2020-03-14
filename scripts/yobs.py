from urllib.request import urlopen

from bs4.element import Comment
from bs4 import BeautifulSoup

import re




url = 'https://www.indeed.com/jobs?q=python'
indeed_url = 'https://www.indeed.com/pagead/clk?mo=r&ad=-6NYlbfkN0BUwDUP2cNE1hB1yfTVrD8_sqUkx3Mr9mcPc6exl0LvjNmJzrcl-LJUtajwpM6XSjBQbklf332fgPMvc68KCzqzEohKS8P3dLkOtob2PgIDo-xmpB3ezlgew1RGAKQNCh3U5sZ0PFdtznFNP0uhPj3uKT1R0WFadak7i2rETtYIxNkfsxBhRf3X3IuV25a0GuFiqegS08oOGZkJhCSYpqWRh8c6XvFtMYEnXdrziRJocsXDwZVUe0aKOKxoCrJrWPmBL1RWUI1Jc8uPlHj3L19DI0KccHSaPGW-rJdeZJHVO8BPFwR1awjrUzdOHtID7NiuJOHmc5Ul9Nohi9P9kb46ivuAMFSXfjd3oUWpk4OK6k_j47R6ySPgjQ01QQSDVpAtTUDDCiLy-QMV81l-kWUhNtCssr2BJ8YJuEkIWh_xskTjPlqfvGUEHHTdJLJ-aSA=&p=0&fvj=1&vjs=3'
yob_url = 'https://prezi.com/jobs/1874899/?gh_id=1874899&location=San%20Francisco'


def scrap_site(url):
    html = urlopen(url)
    bs = BeautifulSoup(html.read(), 'html.parser')
    return bs


def print_title(bs): print(bs.h1)
def print_links(bs): print([link.attrs['href'] for link in bs.find_all('a') if 'href' in link.attrs])
def print_text(bs): print(bs.text)


def get_links(bs): return [link.attrs['href'] for link in bs.find_all('a', href=re.compile('^(/company/)')) if 'href' in link.attrs]


def tag_visible(element):
    if element.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]']: return False
    if isinstance(element, Comment): return False
    return True


def text_from_html(body):
    soup = BeautifulSoup(body, 'html.parser')
    texts = soup.findAll(text=True)
    visible_texts = list(filter(tag_visible, texts))
    scrapped_texts = [{
        'name': x.parent.name,
        'class': x.parent.attrs.get('class'),
        'text':  re.sub(r'  *', ' ', re.sub('\n', ' ',x))
    } for x in visible_texts]
    return [x for x in scrapped_texts if x.get('text') != ' ']


html = urlopen(indeed_url).read()
print(text_from_html(html))
























#links = [link.attrs['href'] for link in bs.find_all('a', href=re.compile('^(/pagead/)')) if 'href' in link.attrs]
#print('Links 1:', links)

#links = [link.attrs['href'] for link in bs.find_all('a', href=re.compile('^(/company/)')) if 'href' in link.attrs]
#print('Links 2:', links)

#bs = scrap_site(yob_url)
#print_links(bs)
#print_title(bs)

#    print('element', element, type(element), vars(element))
#    print(element.parent, type(element.parent), vars(element.parent))




