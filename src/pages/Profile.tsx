import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { upsertProfile } from '@/lib/api/profiles';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [nickname, setNickname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  if (!isAuthenticated || !user) return null;

  const handleSave = async () => {
    await upsertProfile({ id: user.id, nickname, avatar_url: avatarUrl });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>프로필 수정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-1">닉네임</label>
            <Input value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1">아바타 URL</label>
            <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
          </div>
          <Button onClick={handleSave}>저장</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
