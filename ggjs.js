const PROJECT_URL = 'https://hmsovwceyinvwgplgywr.supabase.co';
const ANON_KEY = 'sb_publishable_n4PuuvoT5HLgcKbPM41BkQ_XbKctJtS';
const _supabase = supabase.createClient(PROJECT_URL, ANON_KEY);

// 查询公告并设置内容
async function loadAnnouncement() {
    const { data, error } = await supabase
        .from('announcements')
        .select('content')
        .eq('id', 1)
        .single();

    if (data && !error) {
        document.getElementById('notice-content').innerText = data.content;
    }
}

// 订阅公告变化（实时更新）
function subscribeAnnouncement() {
    supabase
        .channel('announcements')
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'announcements',
            filter: 'id=eq.1'
        }, (payload) => {
            // 收到更新时立即刷新内容
            document.getElementById('notice-content').innerText = payload.new.content;
        })
        .subscribe();
}

// 页面加载时调用
window.onload = () => {
    loadAnnouncement();
    subscribeAnnouncement();
    // ... 其他初始化代码
};